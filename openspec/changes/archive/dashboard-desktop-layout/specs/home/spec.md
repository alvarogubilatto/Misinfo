# Spec: Dashboard Desktop Layout

## Requirements

### REQ-01: Responsive Grid Layout
The Home screen must transition from a single-column mobile layout to a multi-column desktop layout at the 1024px breakpoint.

- **Scenario: Desktop Layout (>= 1024px)**
  - GIVEN the viewport width is 1024px or greater
  - THEN the content should be organized in a grid with columns for hero section, insights, and activity.
  - THEN the BalanceCard should span 2/3 and QuickActions 1/3.

### REQ-02: Quick Actions Reorientation
Quick actions should be horizontal on mobile and vertical on desktop.

- **Scenario: Mobile Quick Actions**
  - GIVEN the viewport width is less than 1024px
  - THEN Quick Actions are displayed in a horizontal row.

- **Scenario: Desktop Quick Actions**
  - GIVEN the viewport width is 1024px or greater
  - THEN Quick Actions are stacked vertically.

### REQ-03: Full Width Container
Desktop layout should use the full available width instead of being constrained to a mobile phone frame.

- **Scenario: App Container Width**
  - GIVEN the viewport is desktop size
  - THEN the `.app-inner` should have a max-width of 1280px and be centered.
