import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { EcoContext, type ActionId } from '../../context/EcoContext';
import * as ai from '../../utils/ai';

vi.mock('../../utils/ai', () => ({
  generateInsights: vi.fn()
}));

vi.mock('../../components/EcoVisualizer', () => ({
  default: () => <div data-testid="eco-visualizer-mock">Visualizer</div>
}));

vi.mock('../../components/SwipeTracker', () => ({
  default: () => <div data-testid="swipe-tracker-mock">Swipe Tracker</div>
}));

const mockEcoValue = {
  score: 50,
  points: 100,
  history: [{ id: 'reusable_cup' as ActionId, text: 'Used a reusable cup', impact: -5, date: new Date().toISOString() }],
  quests: [],
  logAction: vi.fn(),
  resetData: vi.fn(),
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all widgets and AI oracle', async () => {
    vi.mocked(ai.generateInsights).mockResolvedValue([
      { id: '1', text: 'You are doing amazing today!', type: 'praise' }
    ]);

    render(
      <EcoContext.Provider value={mockEcoValue}>
        <Dashboard />
      </EcoContext.Provider>
    );

    expect(screen.getByTestId('dashboard-main')).toBeInTheDocument();
    expect(screen.getByTestId('eco-visualizer-mock')).toBeInTheDocument();
    expect(screen.getByTestId('swipe-tracker-mock')).toBeInTheDocument();
    
    // Verify AI insights loaded
    await waitFor(() => {
      expect(screen.getByText('You are doing amazing today!')).toBeInTheDocument();
    });
  });
});
