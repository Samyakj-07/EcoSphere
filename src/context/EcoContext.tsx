import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export type ActionId = 'reusable_cup' | 'plant_based' | 'transit_bike' | 'cold_wash' | 'no_food_waste' | 'second_hand' | 'short_shower' | 'turn_off_lights';

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
  const [score, setScore] = useState<number>(initialState.score);
  const [points, setPoints] = useState<number>(initialState.points);
  const [history, setHistory] = useState<LoggedAction[]>(initialState.history);
  const [quests, setQuests] = useState<Quest[]>(initialState.quests);
  const [isLoaded, setIsLoaded] = useState(false);

  const getDeviceId = () => {
    let id = localStorage.getItem('ecoSphere_device_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('ecoSphere_device_id', id);
    }
    return id;
  };

  const USER_DOC_ID = React.useMemo(() => getDeviceId(), []);

  // Load from Firebase
  useEffect(() => {
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID === "YOUR_FIREBASE_PROJECT_ID") {
      console.warn("Firebase config is missing in .env.local. Falling back to memory state.");
      setIsLoaded(true);
      return;
    }

    const userDocRef = doc(db, 'users', USER_DOC_ID);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setScore(data.score ?? initialState.score);
        setPoints(data.points ?? initialState.points);
        setHistory(data.history ?? initialState.history);
        setQuests(data.quests ?? initialState.quests);
      } else {
        // Initialize default user if not exists
        setDoc(userDocRef, {
          score: initialState.score,
          points: initialState.points,
          history: initialState.history,
          quests: initialState.quests,
        }).catch(err => console.error("Error creating user doc:", err));
      }
      setIsLoaded(true);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      // Fallback to initial state so the app doesn't freeze
      setIsLoaded(true);
      alert("Database Error: Make sure your Firestore Database is created in 'Test Mode'. Check browser console for details.");
    });

    return () => unsubscribe();
  }, []);

  const logAction = async (actionId: ActionId, text: string, impact: number) => {
    const newScore = Math.max(0, score + impact);
    const newAction: LoggedAction = {
      id: actionId,
      text,
      impact,
      date: new Date().toISOString()
    };
    const newHistory = [newAction, ...history];

    let pointsEarned = 0;
    const newQuests = quests.map(quest => {
      if (!quest.completed && quest.targetActionId === actionId) {
        const newCount = quest.currentCount + 1;
        const isCompleted = newCount >= quest.targetCount;
        if (isCompleted) pointsEarned += quest.points;
        return { ...quest, currentCount: newCount, completed: isCompleted };
      }
      return quest;
    });

    const newPoints = points + pointsEarned;

    // Update state optimistically
    setScore(newScore);
    setPoints(newPoints);
    setHistory(newHistory);
    setQuests(newQuests);

    // Save to Firebase
    if (import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_PROJECT_ID !== "YOUR_FIREBASE_PROJECT_ID") {
        const userDocRef = doc(db, 'users', USER_DOC_ID);
        await setDoc(userDocRef, {
          score: newScore,
          points: newPoints,
          history: newHistory,
          quests: newQuests
        }, { merge: true });
    }
  };

  const resetData = async () => {
    setScore(initialState.score);
    setPoints(initialState.points);
    setHistory(initialState.history);
    setQuests(initialState.quests);

    if (import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_PROJECT_ID !== "YOUR_FIREBASE_PROJECT_ID") {
        const userDocRef = doc(db, 'users', USER_DOC_ID);
        await setDoc(userDocRef, {
          score: initialState.score,
          points: initialState.points,
          history: initialState.history,
          quests: initialState.quests
        });
    }
  };

  if (!isLoaded && import.meta.env.VITE_FIREBASE_PROJECT_ID && import.meta.env.VITE_FIREBASE_PROJECT_ID !== "YOUR_FIREBASE_PROJECT_ID") {
     return <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white font-sans">Connecting to EcoSphere Server...</div>;
  }

  return (
    <EcoContext.Provider value={{ score, points, history, quests, logAction, resetData }}>
      {children}
    </EcoContext.Provider>
  );
};
