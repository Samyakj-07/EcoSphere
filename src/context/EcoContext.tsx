import React, { createContext, useContext, useState, useEffect } from 'react';

export type ActionId = 'reusable_cup' | 'plant_based' | 'transit_bike' | 'cold_wash' | 'no_food_waste';

export interface LoggedAction {
  id: ActionId;
  text: string;
  impact: number;
  date: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  points: number;
  targetActionId: ActionId;
  completed: boolean;
}

interface EcoState {
  score: number;
  points: number;
  history: LoggedAction[];
  quests: Quest[];
  logAction: (actionId: ActionId, text: string, impact: number) => void;
  resetData: () => void;
}

const initialState: EcoState = {
  score: 75,
  points: 0,
  history: [],
  quests: [
    {
      id: 'q1',
      title: 'The Commuter Quest',
      description: 'Take public transit or bike instead of driving twice.',
      targetCount: 2,
      currentCount: 0,
      points: 500,
      targetActionId: 'transit_bike',
      completed: false,
    },
    {
      id: 'q2',
      title: 'Plant Power',
      description: 'Eat a plant-based meal.',
      targetCount: 1,
      currentCount: 0,
      points: 300,
      targetActionId: 'plant_based',
      completed: false,
    }
  ],
  logAction: () => {},
  resetData: () => {},
};

const EcoContext = createContext<EcoState>(initialState);

export const useEco = () => useContext(EcoContext);

export const EcoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('ecoSphere_score');
    return saved ? JSON.parse(saved) : initialState.score;
  });

  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('ecoSphere_points');
    return saved ? JSON.parse(saved) : initialState.points;
  });

  const [history, setHistory] = useState<LoggedAction[]>(() => {
    const saved = localStorage.getItem('ecoSphere_history');
    return saved ? JSON.parse(saved) : initialState.history;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('ecoSphere_quests');
    return saved ? JSON.parse(saved) : initialState.quests;
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('ecoSphere_score', JSON.stringify(score));
    localStorage.setItem('ecoSphere_points', JSON.stringify(points));
    localStorage.setItem('ecoSphere_history', JSON.stringify(history));
    localStorage.setItem('ecoSphere_quests', JSON.stringify(quests));
  }, [score, points, history, quests]);

  const logAction = (actionId: ActionId, text: string, impact: number) => {
    // Update score
    setScore((prev) => Math.max(0, prev + impact)); // Impact is usually negative to reduce footprint
    
    // Add to history
    const newAction: LoggedAction = {
      id: actionId,
      text,
      impact,
      date: new Date().toISOString()
    };
    setHistory((prev) => [newAction, ...prev]);

    // Update Quests
    setQuests((prevQuests) => {
      let pointsEarned = 0;
      const updatedQuests = prevQuests.map(quest => {
        if (!quest.completed && quest.targetActionId === actionId) {
          const newCount = quest.currentCount + 1;
          const isCompleted = newCount >= quest.targetCount;
          if (isCompleted) {
            pointsEarned += quest.points;
          }
          return { ...quest, currentCount: newCount, completed: isCompleted };
        }
        return quest;
      });

      if (pointsEarned > 0) {
        setPoints(p => p + pointsEarned);
      }
      return updatedQuests;
    });
  };

  const resetData = () => {
    setScore(initialState.score);
    setPoints(initialState.points);
    setHistory(initialState.history);
    setQuests(initialState.quests);
  };

  return (
    <EcoContext.Provider value={{ score, points, history, quests, logAction, resetData }}>
      {children}
    </EcoContext.Provider>
  );
};
