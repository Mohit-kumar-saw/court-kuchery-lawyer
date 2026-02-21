import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/services/tokenStorage";
import { socketService } from "@/services/socket";
import type { User } from "@/types";
import { useRouter } from "expo-router";

type AuthContextType = {
  hasCompletedSplash: boolean;
  completeSplash: () => void;
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, phone: string, password: string, specialization: string, experienceYears: string, ratePerMinute: string) => Promise<void>;
  logout: () => Promise<void>;
  activeRequest: any | null;
  clearRequest: () => void;
  activeSessionId: string | null;
  trackActiveSession: (sessionId: string) => Promise<void>;
  clearActiveSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasCompletedSplash, setHasCompletedSplash] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const isLoggedIn = !!user;
  const router = useRouter();

  const SESSION_ID_KEY = "active_session_id";

  const trackActiveSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    await tokenStorage.setActiveSessionData(sessionId);
  }, []);

  const clearActiveSession = useCallback(async () => {
    setActiveSessionId(null);
    await tokenStorage.clearActiveSessionData();
  }, []);

  /* =============================
     SOCKET HANDLERS
  ============================== */
  const setupSocket = useCallback(async () => {
    const socket = await socketService.initialize();
    if (socket) {
      socket.on("CONSULT_REQUEST", (data) => {
        console.log("📥 New Consultation Request:", data);
        setActiveRequest(data);
      });

      socket.on("CONSULT_CANCELLED", (data) => {
        console.log("🚫 Consultation Cancelled:", data);
        setActiveRequest((prev: any) => {
          if (prev?.sessionId === data.sessionId) {
            return null;
          }
          return prev;
        });
      });
    }
  }, []);

  /* =============================
     RESTORE SESSION
  ============================== */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await tokenStorage.getAccessToken();

        if (token) {
          const userProfile = await authService.getProfile();
          setUser(userProfile);

          const storedSessionId = await tokenStorage.getActiveSessionData();
          if (storedSessionId) {
            setActiveSessionId(storedSessionId);
          }
        }
      } catch (err) {
        console.log("RESTORE SESSION ERROR", err);
        await tokenStorage.clear();
      } finally {
        setHasCompletedSplash(true);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setupSocket();
    } else {
      socketService.disconnect();
    }
  }, [isLoggedIn, setupSocket]);

  /* =============================
     SPLASH
  ============================== */
  const completeSplash = useCallback(() => {
    setHasCompletedSplash(true);
  }, []);

  /* =============================
     LOGIN
  ============================== */
  const login = useCallback(async (email: string, password: string) => {
    const user = await authService.login({ email, password });
    setUser(user);
  }, []);

  /* =============================
     SIGN UP
  ============================== */
  const signUp = useCallback(
    async (
      name: string,
      email: string,
      phone: string,
      password: string,
      specialization: string,
      experienceYears: string,
      ratePerMinute: string
    ) => {
      const user = await authService.signUp({
        name,
        email,
        phone,
        password,
        specialization,
        experienceYears,
        ratePerMinute,
      });

      setUser(user);
    },
    []
  );

  /* =============================
     LOGOUT
  ============================== */
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    socketService.disconnect();
  }, []);

  const clearRequest = useCallback(() => {
    setActiveRequest(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        hasCompletedSplash,
        completeSplash,
        user,
        isLoggedIn,
        login,
        signUp,
        logout,
        activeRequest,
        clearRequest,
        activeSessionId,
        trackActiveSession,
        clearActiveSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =============================
   HOOK
============================= */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
