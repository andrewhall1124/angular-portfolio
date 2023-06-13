export interface Stock{
  averageReturn: number;
  close: number[];
  date: string[];
  dividends: number[];
  high: number[];
  industry: string;
  low: number[];
  market_cap: number;
  open: number[];
  sector: string;
  standardDeviation: number;
  stockSplits: number[];
  ticker: string;
  volume: number[];
}