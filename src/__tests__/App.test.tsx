import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import type { Session } from '@supabase/supabase-js';

// Mock del cliente Supabase — controla sesión por test
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      signOut: vi.fn(),
    },
  },
}));

vi.mock('../screens/LoginScreen', () => ({
  default: () => <div data-testid="login-screen" />,
}));

vi.mock('../screens/HomeScreen', () => ({
  default: () => <div data-testid="home-screen" />,
}));

vi.mock('../screens/SubsScreen', () => ({
  default: () => <div data-testid="subs-screen">Suscripciones Content</div>,
}));

vi.mock('../screens/PropsScreen', () => ({
  default: () => <div data-testid="props-screen" />,
}));

vi.mock('../screens/ReportsScreen', () => ({
  default: () => <div data-testid="reports-screen" />,
}));

vi.mock('../components/shared/Icon', () => ({
  Icon: () => <span />,
}));

const fakeSession = { user: { id: 'user-123', email: 'test@misinfo.ar' } } as Session;

const { supabase } = await import('../lib/supabase');

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('onboarding_done', 'true');
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as any);
  });

  it('muestra LoginScreen cuando no hay sesión', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as any);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('login-screen')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('home-screen')).not.toBeInTheDocument();
  });

  it('muestra HomeScreen cuando hay sesión activa', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: fakeSession },
      error: null,
    } as any);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('login-screen')).not.toBeInTheDocument();
  });

  it('navega entre tabs cuando hay sesión', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: fakeSession },
      error: null,
    } as any);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('home-screen')).toBeInTheDocument();
    });

    const subsTab = screen.getAllByText('Suscripciones')
      .find(el => el.closest('button'))?.closest('button');
    subsTab?.click();

    await waitFor(() => {
      expect(screen.getByTestId('subs-screen')).toBeInTheDocument();
    });
  });
});
