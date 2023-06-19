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
  
}