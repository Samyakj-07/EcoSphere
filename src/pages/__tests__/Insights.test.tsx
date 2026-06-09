import { render, screen, waitFor } from '@testing-library/react';
import Insights from '../Insights';
import { EcoContext, type ActionId } from '../../context/EcoContext';
import * as ai from '../../utils/ai';

vi.mock('../../utils/ai', () => ({
  generateInsights: vi.fn()
}));

const mockEcoValue = {
  score: 50,
  points: 100,
  history: [{ id: 'reusable_cup' as ActionId, text: 'Used a reusable cup', impact: -5, date: new Date().toISOString() }],
  quests: [],
  logAction: vi.fn(),
  resetData: vi.fn(),
};

describe('Insights Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders history logs and fetches AI insights', async () => {
    // Mock the API response
    vi.mocked(ai.generateInsights).mockResolvedValue([
      { id: '1', text: 'Incredible work reducing your footprint!', type: 'praise' }
    ]);

    render(
      <EcoContext.Provider value={mockEcoValue}>
        <Insights />
      </EcoContext.Provider>
    );

    // Verify history rendered
    expect(screen.getByText('Used a reusable cup')).toBeInTheDocument();
    
    // Verify API called and UI updated
    await waitFor(() => {
      expect(ai.generateInsights).toHaveBeenCalledWith(mockEcoValue.history, mockEcoValue.score);
      expect(screen.getByText('Incredible work reducing your footprint!')).toBeInTheDocument();
    });
  });
});
