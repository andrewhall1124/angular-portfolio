import { Timestamp } from "@angular/fire/firestore";

export interface Stock{
  close: number[];
  dailyReturns: number[];
  date: string[];
  industry: string;
  longName: string;
  marketCap: number;
  monthlyReturns: number[];
  sector: string;
  summary: string;
  ticker: string;
  weeklyReturns: number[];
}

export interface User {
  displayName: string;
  email: string;
  uid: string;
}

export interface Portfolio {
  count: number;
  name: string,
  created: Timestamp;
  id: string;
  return: number;
  risk: number;
  sharpe: number;
  weight: number;
}