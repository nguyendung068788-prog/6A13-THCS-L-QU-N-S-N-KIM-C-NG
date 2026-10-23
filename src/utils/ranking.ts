import { Student, WeeklyEvaluation, StudentRankResult, DiamondTransaction, ClassId } from '../types';
import { getWeeklyRating, getDiamondReward } from './emulationRules';

export function calculateStudentTotalScore(
  scores: Record<string, number>,
  bonus: number = 0,
  penalty: number = 0
): number {
  const sumCriteria = Object.values(scores).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  return Math.max(0, sumCriteria + (Number(bonus) || 0) - (Number(penalty) || 0));
}

export function computeClassRankings(
  students: Student[],
  currentEval: WeeklyEvaluation | undefined,
  previousEval: WeeklyEvaluation | undefined,
  transactions: DiamondTransaction[]
): StudentRankResult[] {
  if (!currentEval) {
    return students.map((std) => {
      const totalDiamonds = transactions
        .filter((tx) => tx.studentId === std.id)
        .reduce((sum, tx) => sum + tx.amount, 0);

      return {
        student: std,
        currentScore: 0,
        currentRank: 0,
        diamondsEarned: 0,
        totalDiamonds,
        isTop10: false,
        isNewToTop10: false,
        isImproving: false,
        badges: std.badges || []
      };
    });
  }

  // Pre-calculate previous week ranks if available
  const prevRankMap = new Map<string, { rank: number; score: number }>();
  if (previousEval) {
    const prevSorted = students
      .filter((s) => s.classId === previousEval.classId)
      .map((s) => {
        const sc = previousEval.scores[s.id];
        const total = sc ? sc.totalScore : 0;
        return { studentId: s.id, totalScore: total };
      })
      .sort((a, b) => b.totalScore - a.totalScore);

    prevSorted.forEach((item, idx) => {
      prevRankMap.set(item.studentId, { rank: idx + 1, score: item.totalScore });
    });
  }

  // Current scores
  const classStudents = students.filter((s) => s.classId === currentEval.classId);

  // Map students with score and first criterion score for tie breaking
  const firstCritId = currentEval.criteria[0]?.id;
  const scoredList = classStudents.map((std) => {
    const sc = currentEval.scores[std.id];
    const currentScore = sc ? sc.totalScore : 0;
    const firstCritScore = sc?.criteriaScores[firstCritId] || 0;
    const prevData = prevRankMap.get(std.id);
    const scoreDiff = prevData ? currentScore - prevData.score : undefined;

    return {
      student: std,
      currentScore,
      firstCritScore,
      prevScore: prevData?.score,
      scoreDiff,
      prevRank: prevData?.rank
    };
  });

  // Sort based on tie-breaking rule
  scoredList.sort((a, b) => {
    if (b.currentScore !== a.currentScore) {
      return b.currentScore - a.currentScore;
    }
    // Tie-break rules
    if (currentEval.tieBreakRule === 'priority_first_criterion') {
      if (b.firstCritScore !== a.firstCritScore) {
        return b.firstCritScore - a.firstCritScore;
      }
    } else if (currentEval.tieBreakRule === 'progress_priority') {
      const aDiff = a.scoreDiff ?? -999;
      const bDiff = b.scoreDiff ?? -999;
      if (bDiff !== aDiff) {
        return bDiff - aDiff;
      }
    }
    // Fallback: Alphabetical Vietnamese collation to avoid random shifting, but with clear indicator
    return a.student.fullName.localeCompare(b.student.fullName, 'vi');
  });

  // Assign ranks
  const results: StudentRankResult[] = [];
  let currentRank = 1;

  for (let i = 0; i < scoredList.length; i++) {
    const item = scoredList[i];

    if (i > 0 && currentEval.tieBreakRule === 'shared') {
      const prevItem = scoredList[i - 1];
      if (item.currentScore === prevItem.currentScore) {
        // Shared rank: reuse previous rank
        currentRank = results[i - 1].currentRank;
      } else {
        currentRank = i + 1;
      }
    } else {
      currentRank = i + 1;
    }

    const rankDiff = item.prevRank !== undefined ? item.prevRank - currentRank : undefined;
    const isTop10 = currentRank <= 10 && item.currentScore > 0;
    const isNewToTop10 = Boolean(isTop10 && item.prevRank !== undefined && item.prevRank > 10);
    const isImproving = Boolean(item.scoreDiff !== undefined && item.scoreDiff > 0);

    // Calculate diamond reward for this week by score threshold rule (>=60: 2💎, >=50: 1💎)
    const diamondRuleInfo = getDiamondReward(item.currentScore);
    const diamondsByScoreRule = diamondRuleInfo.diamonds;
    const ratingInfo = getWeeklyRating(item.currentScore);
    const weeklyRating = ratingInfo.rating;

    // Total diamonds earned this week (score threshold + top 10 schedule)
    const top10Bonus = isTop10 ? (currentEval.rewardSchedule[currentRank] || 0) : 0;
    const diamondsEarned = diamondsByScoreRule + top10Bonus;

    // Cumulative diamonds
    const studentTxs = transactions.filter((tx) => tx.studentId === item.student.id);
    const totalDiamonds = studentTxs.reduce((sum, tx) => sum + tx.amount, 0);

    // Determine improvement category
    let improvementCategory: StudentRankResult['improvementCategory'];
    if (currentRank <= 3) {
      improvementCategory = 'high_achievement';
    } else if (item.scoreDiff !== undefined && item.scoreDiff >= 8) {
      improvementCategory = 'highest_score_gain';
    } else if (rankDiff !== undefined && rankDiff >= 3) {
      improvementCategory = 'highest_rank_jump';
    } else if (item.scoreDiff !== undefined && item.scoreDiff > 0) {
      improvementCategory = 'criteria_improved';
    } else if (
      (item.scoreDiff !== undefined && item.scoreDiff <= -6) ||
      (item.currentScore > 0 && item.currentScore < 50)
    ) {
      improvementCategory = 'needs_support';
    }

    // Dynamic suggested badges
    const badges = [...(item.student.badges || [])];
    if (item.scoreDiff !== undefined && item.scoreDiff >= 10 && !badges.includes('Bứt phá tuần này')) {
      badges.push('Bứt phá tuần này');
    }
    if (currentRank === 1 && !badges.includes('Ngôi sao Toán học') && item.student.classId.startsWith('math')) {
      badges.push('Ngôi sao Toán học');
    }
    if (item.currentScore >= 60 && !badges.includes('Tiêu biểu 60+ điểm')) {
      badges.push('Tiêu biểu 60+ điểm');
    }

    results.push({
      student: item.student,
      currentScore: item.currentScore,
      previousScore: item.prevScore,
      scoreDiff: item.scoreDiff,
      currentRank,
      previousRank: item.prevRank,
      rankDiff,
      diamondsEarned,
      diamondsByScoreRule,
      weeklyRating,
      totalDiamonds,
      isTop10,
      isNewToTop10,
      isImproving,
      improvementCategory,
      badges
    });
  }

  return results;
}

/**
 * Idempotently generates or updates diamond transactions when locking/closing a week:
 * 1. Score threshold rewards: >=60đ -> +2 💎; 50-59đ -> +1 💎 (Yêu cầu của cô)
 * 2. Top 10 bonuses (nếu có cấu hình)
 */
export function generateWeeklyRewardTransactions(
  evaluation: WeeklyEvaluation,
  rankedResults: StudentRankResult[],
  existingTransactions: DiamondTransaction[]
): { updatedTransactions: DiamondTransaction[]; awardedCount: number; totalDiamondsAwarded: number } {
  // Remove any prior automatic transactions for this week
  const filteredTxs = existingTransactions.filter(
    (tx) =>
      !(
        tx.weekId === evaluation.id &&
        (tx.type === 'weekly_top10' || tx.type === 'weekly_score_reward')
      )
  );

  const newTxs: DiamondTransaction[] = [];
  let totalDiamondsAwarded = 0;

  rankedResults.forEach((res) => {
    // 1. Tặng kim cương theo mức điểm thi đua (>=60: 2 💎, >=50: 1 💎)
    if (res.diamondsByScoreRule && res.diamondsByScoreRule > 0) {
      newTxs.push({
        id: `tx_score_${evaluation.id}_${res.student.id}`,
        weekId: evaluation.id,
        classId: evaluation.classId,
        studentId: res.student.id,
        rank: res.currentRank,
        amount: res.diamondsByScoreRule,
        reason: `Đạt ${res.currentScore}đ thi đua Tuần ${evaluation.weekNumber} (${
          res.diamondsByScoreRule === 2 ? '≥60đ tặng 2 💎' : '≥50đ tặng 1 💎'
        })`,
        timestamp: new Date().toISOString(),
        type: 'weekly_score_reward'
      });
      totalDiamondsAwarded += res.diamondsByScoreRule;
    }

    // 2. Thưởng Top 10 (nếu có cấu hình thưởng thêm)
    if (res.isTop10 && evaluation.rewardSchedule && evaluation.rewardSchedule[res.currentRank]) {
      const topAmount = evaluation.rewardSchedule[res.currentRank];
      if (topAmount > 0) {
        newTxs.push({
          id: `tx_top_${evaluation.id}_${res.student.id}`,
          weekId: evaluation.id,
          classId: evaluation.classId,
          studentId: res.student.id,
          rank: res.currentRank,
          amount: topAmount,
          reason: `Vinh danh Top ${res.currentRank} thi đua Tuần ${evaluation.weekNumber}`,
          timestamp: new Date().toISOString(),
          type: 'weekly_top10'
        });
        totalDiamondsAwarded += topAmount;
      }
    }
  });

  return {
    updatedTransactions: [...filteredTxs, ...newTxs],
    awardedCount: newTxs.length,
    totalDiamondsAwarded
  };
}
