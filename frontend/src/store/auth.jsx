import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initializing as null is better for "checking" state
    const [isLoading, setIsLoading] = useState(true);

    const socket = useMemo(() => {
        return io("http://localhost:3000", {
            autoConnect: true,
            withCredentials:true,
        });
    }, []);


    const LogoutUser = async () => {
        try {
            await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            setUser(null);
            socket.disconnect();
        }
    };


    const userAuthentication = async () => {

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
    }, []);
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
    }, [socket]);
    // Use token existence to determine if "checking" (logged in)
    const isLoggedin = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedin,
                isLoading,
                storeTokenInLS,
                LogoutUser,
                setUser,
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