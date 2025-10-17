import { sdk as miniappSdk } from "@farcaster/miniapp-sdk";
import {
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type EnvironmentContextType = {
  isInMiniApp: boolean;
  isLoading: boolean;
};

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(
  undefined
);

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error(
      "useEnvironment must be used within an EnvironmentProvider"
    );
  }
  return context;
};

type EnvironmentProviderProps = {
  children: ReactNode;
};

export const EnvironmentProvider = ({ children }: EnvironmentProviderProps) => {
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const checkEnvironment = async () => {
      try {
        const inMiniApp = await miniappSdk.isInMiniApp();
        setIsInMiniApp(inMiniApp);
      } catch (_error) {
        setIsInMiniApp(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnvironment();
  }, []);

  const value: EnvironmentContextType = {
    isInMiniApp,
    isLoading,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};
