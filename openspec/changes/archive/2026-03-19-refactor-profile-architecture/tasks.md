# Tasks: Refactor Profile Architecture

## Phase 1: Foundation (Components Creation)

- [x] 1.1 Create `src/components/profile/` directory.
- [x] 1.2 Create `src/components/profile/ProfileHeader.jsx` with breadcrumbs and back button.
- [x] 1.3 Create `src/components/profile/ProfileSectionInfo.jsx` with local state for name editing.
- [x] 1.4 Create `src/components/profile/ProfileSectionSettings.jsx` for the options menu.
- [x] 1.5 Create `src/components/profile/ProfileSectionSecurity.jsx` for security settings.
- [x] 1.6 Create `src/components/profile/ProfileSectionNotifs.jsx` for notification toggles.
- [x] 1.7 Create `src/components/profile/ProfileSectionOthers.jsx` for Terms and Data Export.
- [x] 1.8 Create `src/components/profile/ProfileLogoutDialog.jsx` with the confirmation modal logic.

## Phase 2: Core Implementation (Refactor ProfileScreen)

- [x] 2.1 Refactor `src/screens/ProfileScreen.jsx`:
    - [x] Import all new sub-components.
    - [x] Replace inline render logic with the new specialized components.
    - [x] Clean up unused local state and functions now handled by sub-components.
- [x] 2.2 Verify props wiring between `ProfileScreen` and its new children.

## Phase 3: Testing and Verification

- [x] 3.1 Test (Manual): Verify navigation between "Opciones" and sub-sections works with the new Back button.
- [x] 3.2 Test (Manual): Verify name editing works without lag and saves correctly to global state.
- [x] 3.3 Test (Manual): Verify dark mode toggle and logout confirmation still work.
- [x] 3.4 Build: Run `cmd /c npm run build` to ensure no regressions.

## Phase 4: Cleanup

- [x] 4.1 Remove any dead code or unused comments from `ProfileScreen.jsx`.
- [x] 4.2 Ensure all sub-components are properly documented with their prop expectations.
