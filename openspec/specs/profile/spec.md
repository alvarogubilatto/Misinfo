# Profile Specification

## Purpose

This specification defines the behavior of the new full-screen User Profile and Settings feature (`ProfileScreen.jsx`), which replaces the former overlay side panel (`ProfilePanel.jsx`).

## Requirements

### Requirement: Profile Screen Navigation

The system MUST provide navigation to the dedicated Profile Screen from the main dashboard.

#### Scenario: User opens profile settings
- GIVEN the user is on the `HomeScreen`
- WHEN the user clicks their avatar in the top bar
- THEN the system MUST render the `ProfileScreen` taking up the full viewport
- AND the previous overlay behavior MUST NOT be triggered.

### Requirement: Profile Information Management

The system MUST allow users to view and edit their basic profile information.

#### Scenario: User updates their name
- GIVEN the user is on the `ProfileScreen`
- WHEN the user types a new name in the "Nombre" input
- AND clicks the "Guardar cambios" button
- THEN the system MUST update the global state with the new name
- AND MUST display a success toast ("Perfil actualizado")
- AND MUST return the user to the `HomeScreen`.

### Requirement: Avatar Update

The system SHOULD allow users to upload a new profile picture.

#### Scenario: User selects a valid image
- GIVEN the user is on the `ProfileScreen`
- WHEN the user clicks "Cambiar foto"
- AND selects a valid image file under 2MB
- THEN the system MUST update the avatar in the global state
- AND MUST display a success toast.

#### Scenario: User selects an oversized image
- GIVEN the user is on the `ProfileScreen`
- WHEN the user clicks "Cambiar foto"
- AND selects an image file larger than 2MB
- THEN the system MUST NOT update the avatar
- AND MUST display an error toast ("La foto debe ser menor a 2MB").

### Requirement: Dark Mode Toggle

The system MUST allow the user to toggle the application's visual theme.

#### Scenario: User toggles dark mode
- GIVEN the user is on the `ProfileScreen`
- WHEN the user clicks the "Modo oscuro" toggle switch
- THEN the system MUST update the `darkMode` boolean in the global state
- AND the application's visual theme MUST update immediately.

### Requirement: Settings Sub-sections

The system MUST provide access to nested settings categories (Notifications, Security, Export, Terms).

#### Scenario: User navigates to a sub-section
- GIVEN the user is on the base `ProfileScreen`
- WHEN the user clicks on the "Seguridad" option
- THEN the screen MUST display the Security settings
- AND MUST update the breadcrumb navigation to reflect the current path
- AND MUST provide a way (via breadcrumbs or back button) to return to the main profile view.

### Requirement: Logout Functionality

The system MUST provide a secure way to terminate the current session.

#### Scenario: User confirms logout
- GIVEN the user is on the `ProfileScreen`
- WHEN the user clicks "Cerrar sesión"
- AND clicks "Cerrar sesión" on the confirmation dialog
- THEN the system MUST call the `onLogout` handler
- AND the user MUST be redirected to the `LoginScreen`.
