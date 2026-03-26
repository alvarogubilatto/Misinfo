import { describe, it, expect, beforeEach, vi } from 'vitest';
import { financeService } from '../finance.service';
import { store } from '../../store/store';

// Mock del store si fuera necesario, pero como es un store real simple, lo limpiaremos
describe('financeService', () => {
  beforeEach(() => {
    // Reset store state before each test
    store.setState({
      balance: 1000,
      balanceHidden: false,
      darkMode: false,
      currentTab: 0,
      userName: 'Test User',
      subs: [],
      activities: [],
      accounts: [
        { id: 1, name: 'Main Account', balance: 1000, icon: 'bank', color: 'blue', num: '1234' }
      ],
      properties: [],
      nextId: 100
    });
  });

  describe('addFunds', () => {
    it('should increase global balance and account balance', () => {
      financeService.addFunds(500, 1);
      
      const state = store.getState();
      expect(state.balance).toBe(1500);
      expect(state.accounts[0].balance).toBe(1500);
    });

    it('should add an activity entry', () => {
      financeService.addFunds(500, 1);
      
      const state = store.getState();
      expect(state.activities.length).toBe(1);
      expect(state.activities[0].name).toBe('Depósito manual');
      expect(state.activities[0].amount).toBe(500);
    });
  });

  describe('processPayment', () => {
    it('should decrease balances if enough funds exist', () => {
      financeService.processPayment('Coffee', 10, 1);
      
      const state = store.getState();
      expect(state.balance).toBe(990);
      expect(state.accounts[0].balance).toBe(990);
    });

    it('should NOT decrease balances if NOT enough funds', () => {
      financeService.processPayment('Expensive Car', 1000000, 1);
      
      const state = store.getState();
      expect(state.balance).toBe(1000);
      expect(state.accounts[0].balance).toBe(1000);
    });

    it('should add a negative activity entry for payments', () => {
      financeService.processPayment('Rent', 500, 1);
      
      const state = store.getState();
      expect(state.activities[0].amount).toBe(-500);
    });
  });
});
