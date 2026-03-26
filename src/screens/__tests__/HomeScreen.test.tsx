import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HomeScreen from '../HomeScreen';

// Mock sub-components to simplify testing
vi.mock('../../components/home/HomeHeader', () => ({
  default: ({ openPanel }: any) => <div data-testid="home-header"><button onClick={() => openPanel('profile')}>Profile</button></div>
}));
vi.mock('../../components/home/BalanceCard', () => ({
  default: ({ formatMXN, state }: any) => <div data-testid="balance-card">{formatMXN(state.balance)}</div>
}));
vi.mock('../../components/home/WeeklyDigest', () => ({
  default: () => <div data-testid="weekly-digest" />
}));
vi.mock('../../components/home/UpcomingPayments', () => ({
  default: ({ paySelected }: any) => <div data-testid="upcoming"><button onClick={paySelected}>Pay Selected</button></div>
}));
vi.mock('../../components/home/HomeChart', () => ({
  default: () => <div data-testid="home-chart" />
}));
vi.mock('../../components/home/ActivityList', () => ({
  default: () => <div data-testid="activity-list" />
}));
vi.mock('../../components/shared/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>
}));

const mockProps = {
  state: {
    balance: 1000,
    activities: [],
    subs: [],
    accounts: []
  } as any,
  showToast: vi.fn(),
  showSuccess: vi.fn(),
  toggleDarkMode: vi.fn(),
  openPanel: vi.fn(),
  openModal: vi.fn(),
  switchToSubs: vi.fn(),
  handlePay: vi.fn(),
  formatMXN: (n: number) => `$${n.toFixed(2)}`
};

describe('HomeScreen', () => {
  it('renders all sub-components', () => {
    render(<HomeScreen {...mockProps} />);
    
    expect(screen.getByTestId('home-header')).toBeInTheDocument();
    expect(screen.getByTestId('balance-card')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-digest')).toBeInTheDocument();
    expect(screen.getByTestId('home-chart')).toBeInTheDocument();
    expect(screen.getByTestId('upcoming')).toBeInTheDocument();
    expect(screen.getByTestId('activity-list')).toBeInTheDocument();
  });

  it('handles quick action clicks', () => {
    render(<HomeScreen {...mockProps} />);
    
    fireEvent.click(screen.getByText('Cargar'));
    expect(mockProps.openModal).toHaveBeenCalledWith('addFunds');
    
    fireEvent.click(screen.getByText('Tarjetas'));
    expect(mockProps.openPanel).toHaveBeenCalledWith('accounts');
  });

  it('triggers panel opening from header mock', () => {
    render(<HomeScreen {...mockProps} />);
    fireEvent.click(screen.getByText('Profile'));
    expect(mockProps.openPanel).toHaveBeenCalledWith('profile');
  });

  it('calculates and passes balance correctly to BalanceCard', () => {
    render(<HomeScreen {...mockProps} />);
    expect(screen.getByTestId('balance-card')).toHaveTextContent('$1000.00');
  });
});
