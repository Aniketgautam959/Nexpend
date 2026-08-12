export interface Record {
  date: string | number | Date;
  id: string;
  text: string;
  amount: number;
  category: string;
  merchant?: string | null;
  paymentMethod?: string | null;
  note?: string | null;
  userId: string;
  createdAt: Date;
}
