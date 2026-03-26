import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileScreen from '../ProfileScreen';

// Mock sub-components
vi.mock('../../components/profile/ProfileHeader', () => ({
  default: ({ onNavigate, onClose }: any) => (
    <div data-testid="profile-header">
      <button onClick={() => onNavigate('settings')}>Go to Settings</button>
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

vi.mock('../../components/profile/ProfileSectionInfo', () => ({
  default: ({ onSave, onLogoutRequest }: any) => (
    <div data-testid="section-info">
      <button onClick={() => onSave('New Name')}>Save</button>
      <button onClick={onLogoutRequest}>Logout Request</button>
    </div>
  )
}));

vi.mock('../../components/profile/ProfileSectionSettings', () => ({
  default: () => <div data-testid="section-settings" />
}));

vi.mock('../../components/profile/ProfileLogoutDialog', () => ({
  default: ({ open, onConfirm }: any) => (
    open ? <div data-testid="logout-dialog"><button onClick={onConfirm}>Confirm Logout</button></div> : null
  )
}));

const mockProps = {
  open: true,
  onClose: vi.fn(),
  state: { userName: 'Original Name' } as any,
  showToast: vi.fn(),
  showSuccess: vi.fn(),
  onLogout: vi.fn()
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and shows default profile section', () => {
    render(<ProfileScreen {...mockProps} />);
    expect(screen.getByTestId('profile-header')).toBeInTheDocument();
    expect(screen.getByTestId('section-info')).toBeInTheDocument();
  });

  it('navigates to settings section', () => {
    render(<ProfileScreen {...mockProps} />);
    fireEvent.click(screen.getByText('Go to Settings'));
    
    expect(screen.getByTestId('section-settings')).toBeInTheDocument();
    expect(screen.queryByTestId('section-info')).not.toBeInTheDocument();
  });

  it('handles logout flow', () => {
    render(<ProfileScreen {...mockProps} />);
    
    // Trigger logout request from SectionInfo
    fireEvent.click(screen.getByText('Logout Request'));
    
    // Dialog should appear
    expect(screen.getByTestId('logout-dialog')).toBeInTheDocument();
    
    // Confirm logout
    fireEvent.click(screen.getByText('Confirm Logout'));
    expect(mockProps.onLogout).toHaveBeenCalled();
  });

  it('calls onClose when header close is clicked', () => {
    render(<ProfileScreen {...mockProps} />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
