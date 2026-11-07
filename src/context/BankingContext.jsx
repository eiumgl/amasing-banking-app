import { createContext, useState } from "react";
import { transactions as initialTransactions } from "../data/dummyData";

export const BankingContext = createContext();

export function BankingProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [balance, setBalance] = useState("₱124,480.75");

  return (
    <BankingContext.Provider value={{ transactions, balance, setBalance }}>
      {children}
    </BankingContext.Provider>
  );
}
