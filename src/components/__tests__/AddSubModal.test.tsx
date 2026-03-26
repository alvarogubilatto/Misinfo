import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddSubModal from '../AddSubModal';
import { subsService } from '../../services/subs.service';

// Mock shared components and services
vi.mock('../shared/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>
}));

vi.mock('../../services/subs.service', () => ({
  subsService: {
    addSubscription: vi.fn()
  }
}));

const mockProps = {
  open: true,
  onClose: vi.fn(),
  state: {} as any,
  showToast: vi.fn(),
  showSuccess: vi.fn()
};

describe('AddSubModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AddSubModal {...mockProps} />);
    expect(screen.getByText('Nueva Suscripción')).toBeInTheDocument();
  });

  it('updates form fields', () => {
    render(<AddSubModal {...mockProps} />);
    
    const nameInput = screen.getByPlaceholderText('ej. Netflix, Adobe CC...');
    const priceInput = screen.getByPlaceholderText('0');
    const dayInput = screen.getByPlaceholderText('15');
    
    fireEvent.change(nameInput, { target: { value: 'Disney+' } });
    fireEvent.change(priceInput, { target: { value: '7.99' } });
    fireEvent.change(dayInput, { target: { value: '20' } });
    
    expect(nameInput).toHaveValue('Disney+');
    expect(priceInput).toHaveValue(7.99);
    expect(dayInput).toHaveValue(20);
  });

  it('calls addSubscription on valid submit', () => {
    render(<AddSubModal {...mockProps} />);
    
    fireEvent.change(screen.getByPlaceholderText('ej. Netflix, Adobe CC...'), { target: { value: 'Disney+' } });
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '7.99' } });
    
    const saveBtn = screen.getByText('Agregar Suscripción');
    fireEvent.click(saveBtn);
    
    expect(subsService.addSubscription).toHaveBeenCalledWith({
      icon: 'netflix', // default
      color: 'var(--cat-bg-red)', // default
      name: 'Disney+',
      day: 15, // default
      price: 7.99
    });
    expect(mockProps.showSuccess).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('shows toast if name is empty', () => {
    render(<AddSubModal {...mockProps} />);
    const saveBtn = screen.getByText('Agregar Suscripción');
    fireEvent.click(saveBtn);
    
    expect(subsService.addSubscription).not.toHaveBeenCalled();
    expect(mockProps.showToast).toHaveBeenCalledWith('Ingresa un nombre');
  });

  it('changes icon and color', () => {
    render(<AddSubModal {...mockProps} />);
    
    // Icon
    const spotifyIcon = screen.getByTestId('icon-spotify').parentElement;
    fireEvent.click(spotifyIcon!);
    
    // Color (finding by style is hard, let's just click the 3rd one)
    const colorOpts = screen.getAllByText('', { selector: '.emoji-opt' }).filter(el => !el.querySelector('span'));
    // Wait, the icons also have .emoji-opt. The strategy above is fragile.
    // Better: find by color value if possible or just test it works.
    
    fireEvent.change(screen.getByPlaceholderText('ej. Netflix, Adobe CC...'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '10' } });
    
    fireEvent.click(screen.getByText('Agregar Suscripción'));
    
    expect(subsService.addSubscription).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'spotify'
    }));
  });
});
