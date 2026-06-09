import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EcoProvider, useEco } from '../EcoContext';
import { IMPACT_SCORES } from '../../config/constants';

// Mock Firebase
vi.mock('../../config/firebase', () => ({
  db: {},
  auth: {}
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  onSnapshot: vi.fn((_ref: unknown, callback: (data: unknown) => void) => {
    callback({ exists: () => false });
    return vi.fn();
  })
}));
vi.mock('firebase/auth', () => ({
  signInAnonymously: vi.fn().mockResolvedValue({ user: { uid: 'test-uid' } }),
  onAuthStateChanged: vi.fn((_auth: unknown, callback: (user: unknown) => void) => {
    callback({ uid: 'test-uid' });
    return vi.fn();
  })
}));

const TestComponent = () => {
  const { score, points, logAction } = useEco();
  return (
    <div>
      <div data-testid="score">{score}</div>
      <div data-testid="points">{points}</div>
      <button onClick={() => logAction('plant_based', 'Ate plants', IMPACT_SCORES.plant_based)}>
        Log Action
      </button>
    </div>
  );
};

describe('EcoContext', () => {
  it('initializes with default score', () => {
    render(
      <EcoProvider>
        <TestComponent />
      </EcoProvider>
    );
    expect(screen.getByTestId('score')).toHaveTextContent('75');
  });

  it('updates score and calculates quests when action logged', async () => {
    render(
      <EcoProvider>
        <TestComponent />
      </EcoProvider>
    );
    
    // Plant based meal is a quest that requires 1 action and gives 300 points
    // Impact is -15
    const button = screen.getByText('Log Action');
    
    await act(async () => {
      button.click();
    });

    // Score should be 75 - 15 = 60
    expect(screen.getByTestId('score')).toHaveTextContent('60');
    // Points should be 300
    expect(screen.getByTestId('points')).toHaveTextContent('300');
  });
});
