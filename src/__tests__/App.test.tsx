import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { authService } from '../services/auth.service';

// Mock services and screens
vi.mock('../services/auth.service', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    login: vi.fn(),
    logout: vi.fn()
  }
}));

vi.mock('../screens/LoginScreen', () => ({
  default: ({ onLogin }: any) => (
    <div data-testid="login-screen">
      <button onClick={onLogin}>Login</button>
    </div>
  )
}));

vi.mock('../screens/HomeScreen', () => ({
  default: () => <div data-testid="home-screen" />
}));

vi.mock('../screens/SubsScreen', () => ({
  default: () => <div data-testid="subs-screen">Suscripciones Content</div>
}));

vi.mock('../screens/PropsScreen', () => ({
  default: () => <div data-testid="props-screen" />
}));

vi.mock('../screens/ReportsScreen', () => ({
  default: () => <div data-testid="reports-screen" />
}));

vi.mock('../components/shared/Icon', () => ({
  Icon: () => <span />
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Default: onboarding done to avoid extra overlays
    localStorage.setItem('onboarding_done', 'true');
  });

  it('renders LoginScreen when NOT authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    render(<App />);
    
    expect(screen.getByTestId('login-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('home-screen')).not.toBeInTheDocument();
  });

  it('renders HomeScreen when authenticated', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    render(<App />);
    
    expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    expect(screen.queryByTestId('login-screen')).not.toBeInTheDocument();
  });

  it('calls authService.login when handleLogin is triggered', () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    render(<App />);
    
    fireEvent.click(screen.getByText('Login'));
    expect(authService.login).toHaveBeenCalled();
  });

  it('navigates through tabs', async () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    render(<App />);
    
    const subsTab = screen.getAllByText('Suscripciones').find(el => el.closest('button'))?.closest('button');
    fireEvent.click(subsTab!);
    
    // Use waitFor because AnimatePresence might delay the rendering
    await waitFor(() => {
      expect(screen.getByTestId('subs-screen')).toBeInTheDocument();
    });
  });
});

