import { createContext, useContext, useState } from "react";

import type { ReactNode, Dispatch, SetStateAction } from "react";

type OnlineContextValue = {
  onlineUsers: string[];
  setOnlineUsers: Dispatch<SetStateAction<string[]>>;
};

const OnlineContext = createContext<OnlineContextValue | undefined>(undefined);

export const OnlineProvider = ({ children }: { children: ReactNode }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  return (
    <OnlineContext.Provider value={{ onlineUsers, setOnlineUsers }}>
      {children}
    </OnlineContext.Provider>
  );
};

export const useOnline = () => useContext(OnlineContext)!;
