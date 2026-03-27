# Spec: Premium Payment Flow Redesign

## UI Requirements

### REQ-01: Centered Premium Modal Layout
El modal debe pasar de un bottom-sheet a una tarjeta centrada ("premium-modal") en todas las resoluciones (o al menos un diseño mucho más estructurado en mobile).

- **Scenario: Modal Header**
  - GIVEN a `PayModal` or `AddFundsModal` is open.
  - THEN a centered large icon in a dark rounded box is displayed at the top.
  - THEN the title is centered below the icon.

### REQ-02: Bold Amount Display
The total amount must be prominent.

- **Scenario: Amount Presentation**
  - THEN display "TOTAL A PAGAR" in small uppercase letters.
  - THEN display the amount (e.g., "$ 120.00") in a very large, bold font centered.

### REQ-03: Receipt Details Card
The row-based details (Concept, Date, Commission) must be within a dedicated card.

- **Scenario: Transaction Details**
  - THEN display a light-gray rounded box (`.receipt-card`) summarizing transaction info.
  - THEN show "Concepto", "Fecha", and "Comisión" (with green "Bonificada" text) in rows.

### REQ-04: Payment Method Selector
The payment method should be a clean card with an arrow indicating interaction.

- **Scenario: Selector UI**
  - THEN display a card with the selected account name, icon, and current balance.
  - THEN show a chevron arrow on the right.

### REQ-05: Autorizar Pago Button
The main action button must be the primary visual driver at the bottom.

- **Scenario: Action Button**
  - THEN a large black button with rounded corners is displayed.
  - THEN the button says "Autorizar Pago" and has a green shield icon on the left.
