"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';


const UserContext = createContext<any>(null);


interface UserProviderProps {
    children: ReactNode;
}


export const FeedProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [posts, setPosts] = useState<any>([]);

    return (
        <UserContext.Provider value={{ posts, setPosts }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook per utilizzare il contesto
export const useFeed = () => useContext(UserContext);
