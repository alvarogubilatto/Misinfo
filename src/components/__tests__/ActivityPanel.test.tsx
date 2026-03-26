import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivityPanel from '../ActivityPanel';

// Mock shared components
vi.mock('../shared/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>
}));

const mockProps = {
  open: true,
  onClose: vi.fn(),
  state: {
    activities: [
      { id: 1, name: 'Netflix', meta: 'Pago · Hoy', amount: -15.99, icon: 'tv', bg: 'red', cat: 'servicios' },
      { id: 2, name: 'Sueldo', meta: 'Ingreso · Ayer', amount: 5000, icon: 'ingreso', bg: 'green', cat: 'ingreso' },
      { id: 3, name: 'Supermercado', meta: 'Compra · Hoy', amount: -120.50, icon: 'cart', bg: 'blue', cat: 'compras' }
    ]
  } as any,
  formatMXN: (n: number) => n.toLocaleString('es-MX')
};

describe('ActivityPanel', () => {
  it('renders correctly', () => {
    render(<ActivityPanel {...mockProps} />);
    expect(screen.getByText('Historial completo')).toBeInTheDocument();
  });

  it('renders all activity items', () => {
    render(<ActivityPanel {...mockProps} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Sueldo')).toBeInTheDocument();
    expect(screen.getByText('Supermercado')).toBeInTheDocument();
  });

  it('filters activities by search term', () => {
    render(<ActivityPanel {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Buscar transacción...');
    
    fireEvent.change(searchInput, { target: { value: 'Net' } });
    
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.queryByText('Sueldo')).not.toBeInTheDocument();
  });

  it('filters activities by category', () => {
    render(<ActivityPanel {...mockProps} />);
    
    const filterBtn = screen.getByText('Ingresos');
    fireEvent.click(filterBtn);
    
    expect(screen.getByText('Sueldo')).toBeInTheDocument();
    expect(screen.queryByText('Netflix')).not.toBeInTheDocument();
  });

  it('shows empty state when no results found', () => {
    render(<ActivityPanel {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Buscar transacción...');
    
    fireEvent.change(searchInput, { target: { value: 'ZXZX' } });
    
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    render(<ActivityPanel {...mockProps} />);
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
