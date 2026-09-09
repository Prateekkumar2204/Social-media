import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const socket = useMemo(() => {
        return io(`${import.meta.env.VITE_API_URL}`, {
            autoConnect: true,
            withCredentials: true,
        });
    }, []);

    const LogoutUser = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/check`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                const userData = data.msg;

                setUser(userData);

                if (socket.connected) {
                    socket.emit("add-grp-user", userData._id);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Authentication Error:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        userAuthentication();

        return () => {
            socket.off();
        };
    }, []);

    useEffect(() => {
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

    const isLoggedin = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedin,
                isLoading,
                LogoutUser,
                setUser,
                socket,
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
