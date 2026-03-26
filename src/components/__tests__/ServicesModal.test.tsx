import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ServicesModal from '../ServicesModal';

// Mock shared components
vi.mock('../shared/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>
}));

const mockProps = {
  open: true,
  onClose: vi.fn(),
  propName: 'Casa Principal',
  handlePay: vi.fn(),
  showToast: vi.fn()
};

describe('ServicesModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ServicesModal {...mockProps} />);
    expect(screen.getByText('Servicios del Hogar')).toBeInTheDocument();
    expect(screen.getByText('Casa Principal')).toBeInTheDocument();
  });

  it('renders the list of services', () => {
    render(<ServicesModal {...mockProps} />);
    expect(screen.getByText('Electricidad')).toBeInTheDocument();
    expect(screen.getByText('Agua')).toBeInTheDocument();
    expect(screen.getByText('Gas')).toBeInTheDocument();
  });

  it('calls handlePay when a payable service is clicked', () => {
    vi.useFakeTimers();
    render(<ServicesModal {...mockProps} />);
    
    // Electricidad is payable: true
    const electricService = screen.getByText('Electricidad').closest('.service-item');
    fireEvent.click(electricService!);
    
    // It calls onClose immediately
    expect(mockProps.onClose).toHaveBeenCalled();
    
    // And handlePay after a timeout
    vi.runAllTimers();
    expect(mockProps.handlePay).toHaveBeenCalledWith('Electricidad CFE', 850, 'servicios');
    vi.useRealTimers();
  });

  it('shows toast when a non-payable service is clicked', () => {
    render(<ServicesModal {...mockProps} />);
    
    // Agua is payable: false
    const waterService = screen.getByText('Agua').closest('.service-item');
    fireEvent.click(waterService!);
    
    expect(mockProps.handlePay).not.toHaveBeenCalled();
    expect(mockProps.showToast).toHaveBeenCalledWith('Agua ya pagada este mes');
  });

  it('shows toast when clicking Add Service', () => {
    render(<ServicesModal {...mockProps} />);
    const addBtn = screen.getByText('Agregar servicio');
    fireEvent.click(addBtn);
    expect(mockProps.showToast).toHaveBeenCalledWith('Agregar servicio próximamente');
  });
});
