import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddFundsModal from '../AddFundsModal';
import { financeService } from '../../services/finance.service';

// Mock shared components
vi.mock('../shared/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>
}));

vi.mock('../../services/finance.service', () => ({
  financeService: {
    addFunds: vi.fn()
  }
}));

const mockProps = {
  open: true,
  onClose: vi.fn(),
  state: {
    accounts: [
      { id: 1, name: 'Main Account', balance: 1000, icon: 'bank', color: 'blue', num: '1234' }
    ]
  } as any,
  showToast: vi.fn(),
  showSuccess: vi.fn(),
  formatMXN: (n: number) => `$${n.toFixed(2)}`
};

describe('AddFundsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AddFundsModal {...mockProps} />);
    expect(screen.getByText('Agregar Fondos')).toBeInTheDocument();
  });

  it('updates amount when typing', () => {
    render(<AddFundsModal {...mockProps} />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '500' } });
    expect(input).toHaveValue(500);
  });

  it('sets amount when quick buttons are clicked', () => {
    render(<AddFundsModal {...mockProps} />);
    const quickBtn = screen.getByText('$1,000');
    fireEvent.click(quickBtn);
    expect(screen.getByPlaceholderText('0.00')).toHaveValue(1000);
  });

  it('calls addFunds and shows success on valid submit', () => {
    render(<AddFundsModal {...mockProps} />);
    const input = screen.getByPlaceholderText('0.00');
    fireEvent.change(input, { target: { value: '250' } });
    
    const confirmBtn = screen.getByText('Confirmar').closest('button');
    fireEvent.click(confirmBtn!);
    
    expect(financeService.addFunds).toHaveBeenCalledWith(250, 1);
    expect(mockProps.showSuccess).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('shows error toast on invalid amount', () => {
    render(<AddFundsModal {...mockProps} />);
    const confirmBtn = screen.getByText('Confirmar').closest('button');
    fireEvent.click(confirmBtn!);
    
    expect(financeService.addFunds).not.toHaveBeenCalled();
    expect(mockProps.showToast).toHaveBeenCalled();
  });
});
