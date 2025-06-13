/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode } from "react";

// Tipe user dummy
type User = {
    username: string;
    role: "admin" | "user";
};

// Tipe konteks Auth
type AuthContextType = {
    user: User;
    logout: () => void;
};

// Dummy user
const dummyUser: User = {
    username: "adminUser",
    role: "admin",
};

// Buat konteks dengan nilai awal kosong, lalu isi di Provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const user = dummyUser;

    const logout = () => {
        console.log("Logout");
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
