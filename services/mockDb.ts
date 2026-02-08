
import { User, Transaction, MiningLog, PricePoint } from '../types';

class MockDB {
  private STORAGE_KEY = 'ego_app_data';

  private data: {
    users: User[];
    transactions: Transaction[];
    miningLogs: MiningLog[];
    priceHistory: PricePoint[];
  } = {
    users: [],
    transactions: [],
    miningLogs: [],
    priceHistory: []
  };

  constructor() {
    this.load();
    if (this.data.users.length === 0) {
      // Seed initial dummy users for ranking demo
      this.seed();
    }
  }

  private load() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.data = JSON.parse(saved);
    }
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  private seed() {
    const dummyUsers: User[] = [
      {
        id: 'user_1',
        username: 'cryptoking',
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex@ego.com',
        balance: 145.2,
        referralCode: 'ALEX123',
        totalMined: 45,
        rankingScore: 190,
        createdAt: Date.now() - 30 * 86400000
      },
      {
        id: 'user_2',
        username: 'pinkmoon',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah@ego.com',
        balance: 89.5,
        referralCode: 'SARAH89',
        totalMined: 32,
        rankingScore: 121,
        createdAt: Date.now() - 20 * 86400000
      }
    ];
    this.data.users = dummyUsers;
    this.save();
  }

  getUsers() { return this.data.users; }
  getTransactions() { return this.data.transactions; }
  getMiningLogs() { return this.data.miningLogs; }
  getPriceHistory() { return this.data.priceHistory; }

  addUser(user: User) {
    this.data.users.push(user);
    this.save();
  }

  updateUser(id: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
    }
  }

  addTransaction(tx: Transaction) {
    this.data.transactions.unshift(tx);
    this.save();
  }

  addMiningLog(log: MiningLog) {
    this.data.miningLogs.unshift(log);
    this.save();
  }

  addPricePoint(point: PricePoint) {
    this.data.priceHistory.push(point);
    if (this.data.priceHistory.length > 50) this.data.priceHistory.shift();
    this.save();
  }
}

export const db = new MockDB();
