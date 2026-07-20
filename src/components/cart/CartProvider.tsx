"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  slug: string;
  playerName: string;
  year: number | null;
  brand: string | null;
  price: number;
  imageUrl: string | null;
  quantity: number;
  availableStock: number;
};

type AddToCartItem = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: AddToCartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(
  null,
);

const CART_STORAGE_KEY = "sideline-mentality-cart";

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.id === "string" &&
    typeof item.slug === "string" &&
    typeof item.playerName === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof item.availableStock === "number" &&
    Number.isInteger(item.availableStock) &&
    item.availableStock >= 0
  );
}

export default function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] =
    useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(
        CART_STORAGE_KEY,
      );

      if (!savedCart) {
        setHasLoadedCart(true);
        return;
      }

      const parsedCart: unknown = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        setHasLoadedCart(true);
        return;
      }

      setItems(parsedCart.filter(isValidCartItem));
    } catch (error) {
      console.error("Unable to load shopping cart:", error);
    } finally {
      setHasLoadedCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch (error) {
      console.error("Unable to save shopping cart:", error);
    }
  }, [hasLoadedCart, items]);

  function addItem(item: AddToCartItem) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.id === item.id,
      );

      if (!existingItem) {
        return [
          ...currentItems,
          {
            ...item,
            quantity: 1,
          },
        ];
      }

      return currentItems.map((currentItem) => {
        if (currentItem.id !== item.id) {
          return currentItem;
        }

        return {
          ...currentItem,
          quantity: Math.min(
            currentItem.quantity + 1,
            currentItem.availableStock,
          ),
        };
      });
    });
  }

  function increaseQuantity(id: string) {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(
            item.quantity + 1,
            item.availableStock,
          ),
        };
      }),
    );
  }

  function decreaseQuantity(id: string) {
    setItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }

        if (item.quantity <= 1) {
          return [];
        }

        return [
          {
            ...item,
            quantity: item.quantity - 1,
          },
        ];
      }),
    );
  }

  function removeItem(id: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      addItem,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
    }),
    [items, subtotal, totalItems],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider.",
    );
  }

  return context;
}