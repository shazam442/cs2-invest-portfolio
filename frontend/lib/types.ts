export interface NewTransaction {
  name: string;
  amount: number;
  price: number;
  origin: string;
  date: string;
}

export interface Transaction extends NewTransaction {
  _id: string;
  name: string;
  amount: number;
  price: number;
  origin: string;
  date: string;
  totalPrice: () => number;
  steamValue?: number;
  cashoutMargin?: number;
}