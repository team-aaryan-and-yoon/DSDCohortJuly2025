import type { serviceType } from "@/Types";
import { createContext, useContext, useState, type ReactNode } from "react";


interface CartContextType {
  items: serviceType[];
  setItems: React.Dispatch<React.SetStateAction<serviceType[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<serviceType[]>([]);

  return (
    <CartContext.Provider value={{ items, setItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}