import React, { createContext, useContext, useState, useEffect } from 'react';
import { getVipInfo } from '../data/vipData';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: 'u_admin',
    username: '4siankollective',
    name: 'Admin 4siankollective',
    email: 'admin@taphoa23.vn',
    password: 'admin',
    phone: '0987654321',
    role: 'admin',
    avatar: '👑',
    balance: 99999999,
    totalDeposited: 10000000,
    createdAt: '01/01/2024'
  },
  {
    id: 'u_customer',
    username: 'khachhangvip',
    name: 'Nguyễn Văn VIP',
    email: 'vip@taphoa23.vn',
    password: '123',
    phone: '0988776655',
    role: 'customer',
    avatar: '🎮',
    balance: 550000,
    totalDeposited: 2500000,
    createdAt: '15/02/2024'
  }
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem('tapHoa23RegisteredUsers');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem('tapHoa23RegisteredUsers', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('tapHoa23User');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  });

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tapHoa23RegisteredUsers', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('tapHoa23User', JSON.stringify(currentUser));
        document.body.classList.add('logged-in');
        if (currentUser.role === 'admin' || currentUser.username?.toLowerCase() === '4siankollective') {
          document.body.classList.add('is-admin');
        } else {
          document.body.classList.remove('is-admin');
        }
      } else {
        localStorage.removeItem('tapHoa23User');
        document.body.classList.remove('logged-in');
        document.body.classList.remove('is-admin');
      }
    } catch (e) {}
  }, [currentUser]);

  const isAdmin = Boolean(
    currentUser &&
    (currentUser.role === 'admin' || currentUser.username?.toLowerCase() === '4siankollective')
  );

  const vipInfo = currentUser
    ? getVipInfo(currentUser.totalDeposited || 0, currentUser.role)
    : getVipInfo(0, 'customer');

  const login = async (usernameOrEmail, password) => {
    const cleanInput = (usernameOrEmail || '').trim();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanInput,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('tapHoa23Token', data.token);
        }

        const found = users.find(
          (u) =>
            u.username.toLowerCase() === cleanInput.toLowerCase() ||
            u.email.toLowerCase() === cleanInput.toLowerCase()
        );

        const loggedUser = found || {
          id: 'u_' + (data.username || cleanInput),
          username: data.username || cleanInput,
          name: data.username || cleanInput,
          email: data.email || `${cleanInput}@taphoa23.vn`,
          role: data.role || 'customer',
          avatar: data.role === 'admin' ? '👑' : '👤',
          balance: 0,
          totalDeposited: 0,
          createdAt: new Date().toLocaleDateString('vi-VN'),
        };

        setCurrentUser(loggedUser);
        return { success: true, user: loggedUser };
      } else {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 400) {
          return { success: false, message: errData.message || 'Sai tên đăng nhập hoặc mật khẩu!' };
        }
      }
    } catch (err) {
      console.warn('Backend API /api/auth/login chưa sẵn sàng, dùng tài khoản cục bộ:', err);
    }

    // Fallback: Nếu backend chưa bật hoặc request lỗi mạng, kiểm tra users trong localStorage
    const found = users.find(
      (u) =>
        (u.username.toLowerCase() === cleanInput.toLowerCase() || u.email.toLowerCase() === cleanInput.toLowerCase()) &&
        u.password === password
    );

    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: 'Sai tên đăng nhập/email hoặc mật khẩu!' };
  };

  const register = async ({ username, email, password, phone, name }) => {
    const cleanUser = (username || '').trim();
    const cleanEmail = (email || '').trim();

    if (!cleanUser || !cleanEmail || !password) {
      return { success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc!' };
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUser,
          email: cleanEmail,
          password: password,
          name: name?.trim() || cleanUser,
          phone: phone?.trim() || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('tapHoa23Token', data.token);
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 400) {
          return { success: false, message: errData.message || 'Đăng ký thất bại!' };
        }
      }
    } catch (err) {
      console.warn('Backend API /api/auth/register chưa sẵn sàng, lưu cục bộ:', err);
    }

    const exists = users.some(
      (u) =>
        u.username.toLowerCase() === cleanUser.toLowerCase() ||
        u.email.toLowerCase() === cleanEmail.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'Tên đăng nhập hoặc email đã được sử dụng!' };
    }

    const newUser = {
      id: 'u_' + Date.now(),
      username: cleanUser,
      name: name?.trim() || cleanUser,
      email: cleanEmail,
      password,
      phone: phone?.trim() || '',
      role: 'customer',
      avatar: '👤',
      balance: 0,
      totalDeposited: 0,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    localStorage.removeItem('tapHoa23Token');
    setCurrentUser(null);
  };

  const updateProfile = (fields) => {
    if (!currentUser) return false;
    const updated = { ...currentUser, ...fields };

    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    return true;
  };

  const changePassword = (oldPassword, newPassword) => {
    if (!currentUser) return { success: false, message: 'Chưa đăng nhập!' };
    if (currentUser.password !== oldPassword) {
      return { success: false, message: 'Mật khẩu hiện tại không đúng!' };
    }
    updateProfile({ password: newPassword });
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  };

  // Adjust wallet balance (e.g. deposit or purchase)
  const adjustBalance = (amount, isDeposit = false) => {
    if (!currentUser) return false;
    const newBalance = Math.max(0, (currentUser.balance || 0) + amount);
    const newDeposited = isDeposit
      ? (currentUser.totalDeposited || 0) + Math.max(0, amount)
      : currentUser.totalDeposited || 0;

    const updated = {
      ...currentUser,
      balance: newBalance,
      totalDeposited: newDeposited
    };

    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    return true;
  };

  // Admin function: Pump wallet for any user by username
  const adminPumpUserWallet = (username, amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return false;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.username.toLowerCase() === username.toLowerCase()) {
          const updated = {
            ...u,
            balance: (u.balance || 0) + numAmount,
            totalDeposited: (u.totalDeposited || 0) + numAmount
          };
          if (currentUser && currentUser.id === u.id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    return true;
  };

  // Admin function: Set VIP tier or upgrade user directly
  const adminUpdateUser = (userId, updatedFields) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updatedFields };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        vipInfo,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        adjustBalance,
        adminPumpUserWallet,
        adminUpdateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
