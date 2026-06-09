import { render, screen } from '@testing-library/react';
import Quests from '../Quests';
import { EcoContext, type ActionId } from '../../context/EcoContext';

const mockEcoValue = {
  score: 50,
  points: 800,
  history: [],
  quests: [
    {
      id: 'q1',
      title: 'The Commuter Quest',
      description: 'Take public transit twice.',
      targetCount: 2,
      currentCount: 1,
      points: 500,
      targetActionId: 'transit_bike' as ActionId,
      completed: false,
    }
  ],
  logAction: vi.fn(),
  resetData: vi.fn(),
};

describe('Quests Page', () => {
  it('renders active quests and points correctly', () => {
    render(
      <EcoContext.Provider value={mockEcoValue}>
        <Quests />
      </EcoContext.Provider>
    );

    expect(screen.getByText('Smart Quests')).toBeInTheDocument();
    expect(screen.getByText('The Commuter Quest')).toBeInTheDocument();
    expect(screen.getByText('Take public transit twice.')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
  });
});
