import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SwipeTracker from '../SwipeTracker';

vi.mock('../../context/EcoContext', () => ({
  useEco: () => ({
    logAction: vi.fn(),
    score: 75,
    points: 0,
    history: [],
    quests: []
  })
}));

describe('SwipeTracker Component', () => {
  it('renders the first action correctly', () => {
    render(<SwipeTracker />);
    expect(screen.getByText('Did you use a reusable cup today?')).toBeInTheDocument();
  });
});
