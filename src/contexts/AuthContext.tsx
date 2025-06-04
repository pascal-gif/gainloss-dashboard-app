
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Trade {
  id: string;
  userId: string;
  date: string;
  asset: string;
  amount: number;
  outcome: 'profit' | 'loss';
  value: number;
  notes?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addTrade: (trade: Omit<Trade, 'id' | 'userId' | 'createdAt'>) => void;
  updateTrade: (id: string, trade: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  trades: Trade[];
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('gainloss_user');
    const savedTrades = localStorage.getItem('gainloss_trades');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem('gainloss_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('gainloss_user', JSON.stringify(userWithoutPassword));
      
      // Load user's trades
      const allTrades = JSON.parse(localStorage.getItem('gainloss_trades') || '[]');
      const userTrades = allTrades.filter((t: Trade) => t.userId === user.id);
      setTrades(userTrades);
      
      return true;
    }
    
    return false;
  };

  const signup = async (fullName: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('gainloss_users') || '[]');
    
    // Check if email already exists
    if (users.some((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      fullName,
      email,
      password
    };
    
    users.push(newUser);
    localStorage.setItem('gainloss_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('gainloss_user', JSON.stringify(userWithoutPassword));
    setTrades([]);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setTrades([]);
    localStorage.removeItem('gainloss_user');
  };

  const addTrade = (tradeData: Omit<Trade, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
      userId: user.id,
      value: tradeData.outcome === 'loss' ? -Math.abs(tradeData.value) : Math.abs(tradeData.value),
      createdAt: new Date().toISOString()
    };
    
    const allTrades = JSON.parse(localStorage.getItem('gainloss_trades') || '[]');
    allTrades.push(newTrade);
    localStorage.setItem('gainloss_trades', JSON.stringify(allTrades));
    
    setTrades(prev => [...prev, newTrade]);
  };

  const updateTrade = (id: string, updates: Partial<Trade>) => {
    const allTrades = JSON.parse(localStorage.getItem('gainloss_trades') || '[]');
    const tradeIndex = allTrades.findIndex((t: Trade) => t.id === id);
    
    if (tradeIndex !== -1) {
      allTrades[tradeIndex] = { ...allTrades[tradeIndex], ...updates };
      localStorage.setItem('gainloss_trades', JSON.stringify(allTrades));
      
      setTrades(prev => prev.map(trade => 
        trade.id === id ? { ...trade, ...updates } : trade
      ));
    }
  };

  const deleteTrade = (id: string) => {
    const allTrades = JSON.parse(localStorage.getItem('gainloss_trades') || '[]');
    const filteredTrades = allTrades.filter((t: Trade) => t.id !== id);
    localStorage.setItem('gainloss_trades', JSON.stringify(filteredTrades));
    
    setTrades(prev => prev.filter(trade => trade.id !== id));
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('gainloss_user', JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('gainloss_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('gainloss_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      addTrade,
      updateTrade,
      deleteTrade,
      trades,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
