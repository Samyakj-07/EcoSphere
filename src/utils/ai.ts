import type { LoggedAction } from '../context/EcoContext';

export interface InsightMessage {
  id: string;
  text: string;
  type: 'praise' | 'suggestion' | 'neutral';
}

export function generateInsights(history: LoggedAction[], currentScore: number): InsightMessage[] {
  const insights: InsightMessage[] = [];

  // Base state
  if (history.length === 0) {
    insights.push({
      id: 'init-1',
      text: "Welcome to EcoSphere! Start logging your daily actions in the Swipe Tracker to shrink your footprint. I'll monitor your progress and give you tailored advice here.",
      type: 'neutral'
    });
    return insights;
  }

  // Analyze history
  const plantBasedCount = history.filter(a => a.id === 'plant_based').length;
  const transitCount = history.filter(a => a.id === 'transit_bike').length;
  const reusableCount = history.filter(a => a.id === 'reusable_cup').length;

  // Praise logic
  if (transitCount > 0) {
    insights.push({
      id: 'praise-transit',
      text: `Awesome job choosing active/public transit recently! Transportation is often our biggest emission source, so leaving the car behind is huge.`,
      type: 'praise'
    });
  } else if (plantBasedCount > 0) {
    insights.push({
      id: 'praise-food',
      text: `Your diet choices are making an impact. Eating plant-based meals drastically reduces water use and methane emissions compared to meat.`,
      type: 'praise'
    });
  } else if (reusableCount > 0) {
    insights.push({
      id: 'praise-cup',
      text: `Great habit using your reusable cup. Small actions compound over time to significantly reduce plastic waste.`,
      type: 'praise'
    });
  }

  // Suggestion logic based on what's missing
  if (transitCount === 0 && currentScore > 40) {
    insights.push({
      id: 'suggest-transit',
      text: `I noticed you haven't logged any alternative transit yet. Try swapping one car trip for a bike ride or bus this week to cool your EcoSphere down!`,
      type: 'suggestion'
    });
  } else if (plantBasedCount === 0) {
    insights.push({
      id: 'suggest-food',
      text: `A quick way to drop your footprint score is adjusting your diet. Consider attempting a "Meatless Monday" next week.`,
      type: 'suggestion'
    });
  }

  // Score specific insight
  if (currentScore < 40) {
    insights.push({
      id: 'score-good',
      text: `Your EcoSphere is radiant! You are maintaining a footprint well below the national average. Keep up the incredible work.`,
      type: 'praise'
    });
  } else if (currentScore > 70) {
    insights.push({
      id: 'score-bad',
      text: `Your EcoSphere is running a bit hot. Don't worry, start with the simple daily actions on your dashboard to bring it down.`,
      type: 'neutral'
    });
  }

  // Return the most relevant 2 or 3 insights
  return insights.slice(0, 3);
}
