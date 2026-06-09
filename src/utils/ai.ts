import type { LoggedAction } from '../context/EcoContext';

export interface InsightMessage {
  id: string;
  text: string;
  type: 'praise' | 'suggestion' | 'neutral';
}

export async function generateInsights(history: LoggedAction[], currentScore: number): Promise<InsightMessage[]> {
  try {
    // Compress history to minimize payload
    const compressedHistory = history.slice(0, 10).map(a => ({ a: a.id, i: a.impact }));
    
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history: compressedHistory,
        currentScore
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.text || 'Failed to fetch insights from server');
    }

    const parsedInsight = await response.json();
    return [parsedInsight];
  } catch (error: any) {
    console.error("Insight Fetch Error:", error);
    return [{ 
      id: 'error-fallback', 
      text: `AI Oracle Error: ${error.message || 'Unknown error'}`, 
      type: 'neutral' 
    }];
  }
}
