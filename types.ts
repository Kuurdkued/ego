
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  balance: number;
  referralCode: string;
  referredBy?: string;
  lastMiningTimestamp?: number;
  totalMined: number;
  rankingScore: number;
  createdAt: number;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  note?: string;
  timestamp: number;
  type: 'transfer' | 'mining' | 'referral';
}

export interface MiningLog {
  id: string;
  userId: string;
  amount: number;
  timestamp: number;
}

export interface PricePoint {
  price: number;
  timestamp: number;
}
