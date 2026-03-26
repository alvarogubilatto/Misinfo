import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AccountsPanel from '../AccountsPanel';

// Mock shared components
vi.mock('../shared/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>
}));

const mockProps = {
  open: true,
  onClose: vi.fn(),
  state: {
    accounts: [
      { id: 1, name: 'Santander', balance: 1500, icon: 'bank', color: 'red', num: '**** 1234' },
      { id: 2, name: 'Mercado Pago', balance: 500, icon: 'wallet', color: 'blue', num: 'CVU 0001' }
    ]
  } as any,
  formatMXN: (n: number) => n.toLocaleString('es-MX'),
  showToast: vi.fn()
};

describe('AccountsPanel', () => {
  it('renders correctly', () => {
    render(<AccountsPanel {...mockProps} />);
    expect(screen.getByText('Mis Cuentas')).toBeInTheDocument();
  });

  it('calculates and displays total balance', () => {
    render(<AccountsPanel {...mockProps} />);
    // 1500 + 500 = 2000
    expect(screen.getByText('$2,000')).toBeInTheDocument();
  });

  it('renders all account cards', () => {
    render(<AccountsPanel {...mockProps} />);
    expect(screen.getByText('Santander')).toBeInTheDocument();
    expect(screen.getByText('Mercado Pago')).toBeInTheDocument();
    expect(screen.getByText('**** 1234')).toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    render(<AccountsPanel {...mockProps} />);
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('shows toast when clicking Connect Account', () => {
    render(<AccountsPanel {...mockProps} />);
    const connectBtn = screen.getByText('Conectar nueva cuenta');
    fireEvent.click(connectBtn);
    expect(mockProps.showToast).toHaveBeenCalled();
  });
});
