import { createContext, useState } from "react";
export const LoggedContext = createContext({});

export function LoggedContextProvider({ children }) {
  const [auth, setAuth] = useState({ token: null });

  return (
    <LoggedContext.Provider value={{ auth, setAuth }}>
      {children}
    </LoggedContext.Provider>
  );
}
