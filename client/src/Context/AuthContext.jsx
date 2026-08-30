import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import socket from "../socket";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  /* =========================
     RESTORE AUTH
  ========================= */

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    const storedToken =
      localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error(
          "Failed to restore user:",
          error
        );

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setToken(null);
      }
    }

    setLoading(false);
  }, []);

  /* =========================
     SOCKET CONNECTION
  ========================= */

  useEffect(() => {
    const userId =
      user?._id ||
      user?.id ||
      user?.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }

    // Connect to Socket.IO
    socket.connect();

    // Join this user's private room
    socket.emit(
      "joinUser",
      userId
    );

    console.log(
      "Joined socket room:",
      `user_${userId}`
    );

    return () => {
      socket.disconnect();
    };
  }, [user]);

  /* =========================
     LOGIN
  ========================= */

  const login = (
    userData,
    userToken
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      userToken
    );

    setUser(userData);
    setToken(userToken);
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    console.log("LOGOUT CLICKED");

    socket.disconnect();

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  /* =========================
     AUTH STATUS
  ========================= */

  const authenticated =
    !!user && !!token;

  const value = {
    user,
    token,
    loading,
    authenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   USE AUTH
========================= */

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}