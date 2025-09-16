export type NewCsTransaction = Partial<CsTransaction> & { unit_price: number };

export type CsTransaction = {
  id: number;
  name: string;
  origin: string;
  transacted_at: string;
  unit_factor: number;
  unit_price: number;
  created_at: string;
};

export type User = {
  id: string;
  email: string;
}