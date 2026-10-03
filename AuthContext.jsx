import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "abiaride-demo-state";
const AuthContext = createContext(null);

const initialTransactions = [
  {
    id: "tx-opening",
    label: "Opening demo balance",
    method: "Demo wallet",
    amount: 650,
    balanceImpact: 650,
    createdAt: "2026-10-01T09:00:00.000Z",
    kind: "funding",
  },
  {
    id: "tx-seed-fund",
    label: "Funded ₦2,000 via Bank Transfer",
    method: "Bank Transfer",
    amount: 2000,
    balanceImpact: 2000,
    createdAt: "2026-10-02T10:00:00.000Z",
    kind: "funding",
  },
  {
    id: "tx-seed-fare",
    label: "Green Shuttle Fare",
    method: "Abia Connect Wallet",
    amount: 150,
    balanceImpact: -150,
    createdAt: "2026-10-03T08:30:00.000Z",
    kind: "fare",
  },
];

const initialState = {
  user: null,
  walletBalance: 2500,
  transactions: initialTransactions,
  passes: [],
};

function readSavedState() {
  try {
    const savedState = window.localStorage.getItem(STORAGE_KEY);
    if (!savedState) return initialState;
    const parsed = JSON.parse(savedState);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Saved demo profile has an invalid format.");
    }
    return {
      ...initialState,
      ...parsed,
      transactions: Array.isArray(parsed.transactions)
        ? parsed.transactions
        : initialTransactions,
      passes: Array.isArray(parsed.passes) ? parsed.passes : [],
    };
  } catch (error) {
    console.error("Unable to restore the AbiaRide demo session.", error);
    return initialState;
  }
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(readSavedState);
  const [authOpen, setAuthOpen] = useState(false);
  const [persistenceError, setPersistenceError] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setPersistenceError("");
    } catch (error) {
      console.error("Unable to save the AbiaRide demo session.", error);
      setPersistenceError("This browser could not save your demo session.");
    }
  }, [state]);

  function login(role, name) {
    const defaultProfile =
      role === "inspector"
        ? {
            name: "Chinedu Okoro",
            passengerId: "ABR-INS-0012",
            email: "inspector@abiaride.demo",
            avatar: "CO",
            role: "inspector",
          }
        : {
            name: "Adaeze Okafor",
            passengerId: "ABR-UMU-2048",
            email: "rider@abiaride.demo",
            avatar: "AO",
            role: "rider",
          };
    setState((current) => ({
      ...current,
      user: {
        ...defaultProfile,
        ...(name ? { name, avatar: name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() } : {}),
      },
    }));
    setAuthOpen(false);
  }

  function logout() {
    setState((current) => ({ ...current, user: null }));
  }

  function addFunds(amount, method = "Bank Transfer") {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Choose a valid wallet top-up amount.");
    }
    const transaction = {
      id: `TX-${Date.now()}`,
      label: `Funded ${new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(amount)} via ${method}`,
      method,
      amount,
      balanceImpact: amount,
      createdAt: new Date().toISOString(),
      kind: "funding",
    };
    const nextState = {
      ...state,
      walletBalance: state.walletBalance + amount,
      transactions: [transaction, ...state.transactions],
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      setPersistenceError("");
    } catch (error) {
      console.error("Unable to persist the wallet top-up.", error);
      setPersistenceError("Wallet top-up could not be saved.");
      throw new Error("Wallet top-up could not be saved. Please enable browser storage and try again.");
    }
    setState(nextState);
    return transaction;
  }

  function completePayment({ route, passengerCount, paymentMethod }) {
    if (!state.user) {
      setAuthOpen(true);
      return null;
    }
    const totalPaid = route.fareNgn * passengerCount;
    if (!Number.isInteger(passengerCount) || passengerCount < 1 || passengerCount > 5) {
      throw new Error("Select between 1 and 5 passengers.");
    }
    if (paymentMethod === "Abia Connect Wallet" && state.walletBalance < totalPaid) {
      throw new Error("Your wallet balance is too low. Top up and try again.");
    }
    const reference = `ABR-${Date.now().toString(36).toUpperCase()}`;
    const transaction = {
      id: reference,
      label: "Green Shuttle Fare",
      method: paymentMethod,
      amount: totalPaid,
      balanceImpact: paymentMethod === "Abia Connect Wallet" ? -totalPaid : 0,
      createdAt: new Date().toISOString(),
      kind: "fare",
    };
    const pass = {
      id: reference,
      routeId: route.id,
      routeName: route.name,
      holderName: state.user.name,
      holderAvatar: state.user.avatar,
      passengerId: state.user.passengerId,
      passengerCount,
      totalPaid,
      reference,
      paymentMethod,
      paidAt: transaction.createdAt,
      status: "paid",
    };
    const nextState = {
      ...state,
      walletBalance:
        paymentMethod === "Abia Connect Wallet"
          ? state.walletBalance - totalPaid
          : state.walletBalance,
      transactions: [transaction, ...state.transactions],
      passes: [pass, ...state.passes],
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      setPersistenceError("");
    } catch (error) {
      console.error("Unable to persist the paid Green Shuttle pass.", error);
      setPersistenceError("Payment could not be saved.");
      throw new Error("Payment could not be saved, so no pass was issued. Please enable browser storage and try again.");
    }
    setState(nextState);
    return pass;
  }

  const value = useMemo(
    () => ({
      ...state,
      authOpen,
      persistenceError,
      setAuthOpen,
      login,
      logout,
      addFunds,
      completePayment,
    }),
    [state, authOpen, persistenceError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
