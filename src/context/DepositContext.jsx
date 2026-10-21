import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const DepositContext = createContext(null);

const DEFAULT_DEPOSITS = [
  {
    id: 'NAP-882910',
    username: 'khachhangvip',
    amount: 500000,
    method: 'banking',
    memo: 'NAP KHACHHANGVIP',
    status: 'approved',
    createdAt: '20/10/2026 14:32:10',
    approvedAt: '20/10/2026 14:35:00'
  },
  {
    id: 'NAP-994120',
    username: 'khachhangvip',
    amount: 2000000,
    method: 'banking',
    memo: 'NAP KHACHHANGVIP',
    status: 'approved',
    createdAt: '21/10/2026 09:15:20',
    approvedAt: '21/10/2026 09:18:00'
  }
];

export function DepositProvider({ children }) {
  const { adminPumpUserWallet } = useAuth();
  const { showToast } = useToast();

  const [depositRequests, setDepositRequests] = useState(() => {
    try {
      const raw = localStorage.getItem('tapHoa23DepositRequests');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    localStorage.setItem('tapHoa23DepositRequests', JSON.stringify(DEFAULT_DEPOSITS));
    return DEFAULT_DEPOSITS;
  });

  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem('tapHoa23Orders');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      {
        id: 'DH-789012',
        username: 'khachhangvip',
        buyerName: 'Nguyễn Văn VIP',
        buyerEmail: 'vip@taphoa23.vn',
        buyerPhone: '0988776655',
        paymentMethod: 'wallet',
        total: 25000,
        status: 'completed',
        createdAt: '21/10/2026 10:20:00',
        items: [
          {
            id: 3,
            name: 'Key Steam Random AAA Game',
            price: 25000,
            quantity: 1,
            deliveredKeys: ['STEAM-AAAA-BBBB-CCCC']
          }
        ]
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tapHoa23DepositRequests', JSON.stringify(depositRequests));
    } catch (e) {}
  }, [depositRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('tapHoa23Orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const createDepositRequest = ({ username, amount, method = 'banking', memo = '', proofImg = '' }) => {
    const numAmount = Number(amount);
    if (!username || isNaN(numAmount) || numAmount < 10000) {
      showToast('⚠️ Số tiền nạp tối thiểu là 10.000đ!', 'error');
      return null;
    }

    const id = 'NAP-' + Date.now().toString().slice(-6);
    const req = {
      id,
      username,
      amount: numAmount,
      method,
      memo: memo || `NAP ${username.toUpperCase()}`,
      proofImg,
      status: 'pending',
      createdAt: new Date().toLocaleString('vi-VN')
    };

    setDepositRequests((prev) => [req, ...prev]);
    showToast('🚀 Đã gửi yêu cầu nạp tiền! Vui lòng chờ Admin duyệt trong 1-5 phút.');
    return req;
  };

  const approveDepositRequest = (reqId) => {
    const req = depositRequests.find((r) => r.id === reqId);
    if (!req || req.status === 'approved') return false;

    setDepositRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'approved',
              approvedAt: new Date().toLocaleString('vi-VN')
            }
          : r
      )
    );

    // Pump wallet
    adminPumpUserWallet(req.username, req.amount);
    showToast(`✅ Đã phê duyệt nạp +${req.amount.toLocaleString('vi-VN')}đ cho khách "${req.username}"!`);
    return true;
  };

  const rejectDepositRequest = (reqId, reason = '') => {
    setDepositRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'rejected',
              rejectReason: reason,
              rejectedAt: new Date().toLocaleString('vi-VN')
            }
          : r
      )
    );
    showToast(`Đã từ chối yêu cầu nạp #${reqId}`);
    return true;
  };

  const createOrder = (orderData) => {
    const id = 'DH-' + Date.now().toString().slice(-6);
    const newOrder = {
      ...orderData,
      id,
      createdAt: new Date().toLocaleString('vi-VN')
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <DepositContext.Provider
      value={{
        depositRequests,
        orders,
        createDepositRequest,
        approveDepositRequest,
        rejectDepositRequest,
        createOrder
      }}
    >
      {children}
    </DepositContext.Provider>
  );
}

export function useDeposit() {
  const context = useContext(DepositContext);
  if (!context) {
    throw new Error('useDeposit must be used within DepositProvider');
  }
  return context;
}
