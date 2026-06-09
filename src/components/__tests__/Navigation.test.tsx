import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';

describe('Navigation Component', () => {
  it('renders the branding and navigation links correctly', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
    
    // Verify Brand
    expect(screen.getByTestId('nav-brand')).toHaveTextContent('EcoSphere');
    
    // Verify Links
    expect(screen.getByTestId('nav-link-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-quests')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-insights')).toBeInTheDocument();
    
    // Verify ARIA label
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main Navigation');
  });
});
