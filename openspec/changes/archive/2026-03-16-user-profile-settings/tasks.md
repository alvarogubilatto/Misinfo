# Tasks: User Profile Settings Screen

## Phase 1: Foundation (Structure and CSS)

- [x] 1.1 Create `src/screens/ProfileScreen.jsx`.
- [x] 1.2 Copy the basic structural JSX from `src/components/ProfilePanel.jsx` into `ProfileScreen.jsx`, changing the root class from `.side-panel` to `.profile-screen`.
- [x] 1.3 Update `src/index.css` to add the `.profile-screen` base class. It must use `position: fixed`, `top/bottom/left/right: 0`, and the `slide-up` animation (similar to `.modal-sheet` entrance but taking up 100% height).
- [x] 1.4 Test (Manual): Verify the basic empty screen CSS renders correctly when toggled manually.

## Phase 2: Core Implementation (State and Logic Migration)

- [x] 2.1 Migrate local state (e.g., `activeSection`, `editName`, `avatarFile`) and props (`state`, `setState`, `showToast`, etc.) from `ProfilePanel.jsx` to `ProfileScreen.jsx`.
- [x] 2.2 Migrate all sub-section rendering functions (Profile, Notifs, Security, Export, Terms) and helper functions (`saveName`, `handleFileChange`, etc.) to `ProfileScreen.jsx`.
- [x] 2.3 Add a "Close/Back" button or keep the existing header close button to trigger the `onClose` prop.
- [x] 2.4 In `src/App.jsx`, replace the `<ProfilePanel>` import and render with `<ProfileScreen>`. Keep the exact same props (`open={openPanel === 'profile'}`).

## Phase 3: Testing and Polish

- [x] 3.1 Test (Manual): Open Profile Screen from `HomeScreen.jsx` avatar. Ensure it animates `slide-up` properly.
- [x] 3.2 Test (Manual): Modify the user's name and verify it updates the global state and `HomeScreen`.
- [x] 3.3 Test (Manual): Toggle Dark Mode and verify global visual update.
- [x] 3.4 Test (Manual): Navigate through internal settings breadcrumbs (Security, Terms, etc.) and ensure they work as expected.
- [x] 3.5 Test (Manual): Click Logout and confirm redirect to LoginScreen.

## Phase 4: Cleanup

- [x] 4.1 Delete `src/components/ProfilePanel.jsx`.
- [x] 4.2 Remove `.side-panel` and related unused CSS from `src/index.css` (assuming no other component uses it).
