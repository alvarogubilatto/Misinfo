import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PayModal from '../PayModal';
import { financeService } from '../../services/finance.service';

// Mock components and services
vi.mock('../shared/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>
}));

vi.mock('../../services/finance.service', () => ({
  financeService: {
    processPayment: vi.fn()
  }
}));

const mockProps = {
  open: true,
  onClose: vi.fn(),
  pendingPay: {
    name: 'Netflix',
    amount: 15.99,
    icon: 'tv'
  },
  state: {
    balance: 100,
    accounts: [
      { id: 1, name: 'Main Account', balance: 100, icon: 'bank', color: 'blue', num: '1234' }
    ],
    // dummy context
    balanceHidden: false,
    darkMode: false,
    currentTab: 0,
    userName: 'User',
    subs: [],
    activities: [],
    properties: [],
    nextId: 1
  } as any,
  showToast: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
  formatMXN: (n: number) => `$${n.toFixed(2)}`
};

describe('PayModal', () => {
  it('renders standard payment details', () => {
    render(<PayModal {...mockProps} />);
    
    expect(screen.getByText('Confirmar Pago')).toBeInTheDocument();
    expect(screen.getAllByText('Netflix').length).toBeGreaterThan(0);
    // Buscamos el monto sin asumir separador de miles/decimales exacto si falla, 
    // pero el snapshot mostró 15.99
    expect(screen.getByText(/15.99/)).toBeInTheDocument();
  });

  it('calls processPayment when autorizar is clicked', () => {
    render(<PayModal {...mockProps} />);
    
    const payBtn = screen.getByText('Autorizar').closest('button');
    fireEvent.click(payBtn!);
    
    expect(financeService.processPayment).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.showSuccess).toHaveBeenCalled();
  });

  it('shows error if balance is insufficient', () => {
    // IMPORTANTE: Asegurarnos de que el Mock de processPayment esté limpio
    vi.mocked(financeService.processPayment).mockClear();

    const lowBalanceProps = {
      ...mockProps,
      state: { 
        ...mockProps.state, 
        balance: 5 // Saldo menor a 15.99
      }
    };
    
    render(<PayModal {...lowBalanceProps} />);
    
    const payBtn = screen.getByText('Autorizar').closest('button');
    fireEvent.click(payBtn!);
    
    expect(financeService.processPayment).not.toHaveBeenCalled();
    expect(mockProps.showError).toHaveBeenCalledWith('Saldo insuficiente', expect.any(String));
  });
});
