import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null); // Initializing as null is better for "checking" state
    const [isLoading, setIsLoading] = useState(true);
 
    const socket = useMemo(() => {
        return io("http://localhost:3000", {
            autoConnect: true,
        });
    }, []);

    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem("token", serverToken);
    };

    const LogoutUser = () => {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        socket.disconnect(); // Manually disconnect on logout
    };

    const userAuthentication = async () => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/check", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const userData = data.msg;

                // 2. EMIT EVENT ONCE DATA IS FETCHED
                // We use userData directly here because setUser is asynchronous
                socket.emit("add-grp-user", userData._id);
                setUser(userData);
            } else {
                // If token is invalid, log them out
                LogoutUser();
            }
        } catch (error) {
            console.error("Authentication Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        userAuthentication();

        // 3. CLEANUP FUNCTION
        // This runs when the provider unmounts (e.g., tab closed)
        return () => {
            socket.off(); // Remove all listeners
        };
    }, [token]);
    useEffect(() => {
    if (!socket || !token) return;

    const handleIncomingVideoCall = (data) => {
        const inviteCode = data.roomId || data.message;

        if (!inviteCode) return;

        window.location.href = `/video-call?room=${inviteCode}`;
    };

    socket.on("video-call-receive", handleIncomingVideoCall);

    return () => {
        socket.off("video-call-receive", handleIncomingVideoCall);
    };
}, [socket, token]);
    // Use token existence to determine if "checking" (logged in)
    const isLoggedin = !!token;

    return (
        <AuthContext.Provider 
            value={{ 
                token, 
                user, 
                isLoggedin, 
                isLoading,
                storeTokenInLS, 
                LogoutUser, 
                setUser, 
                setToken, 
                socket 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the provider");
    }
    return authContextValue;
};