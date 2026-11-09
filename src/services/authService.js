/**
 * EcoClean Municipal Smart Waste Management System
 * Authentication Service (Mock / API ready)
 */

export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@ecoclean.com',
    password: 'admin123',
    role: 'admin',
    phone: '555-0100',
    department: 'Operations',
    avatar: null
  },
  {
    id: 2,
    name: 'James Wilson',
    email: 'driver@ecoclean.com',
    password: 'driver123',
    role: 'driver',
    phone: '555-0201',
    driverId: 'DRV-001',
    vehicle: 'Truck #T-101 (Ford F-650)',
    vehicleId: 'VH-001',
    shift: 'Morning',
    avatar: null
  }
];

// POST /api/auth/login
export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email?.trim().toLowerCase() && u.password === password
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        const token = `mock-jwt-token-${user.id}-${Date.now()}`;
        localStorage.setItem('ecoclean_token', token);
        localStorage.setItem('ecoclean_user', JSON.stringify(userWithoutPassword));
        resolve({ user: userWithoutPassword, token });
      } else {
        reject(new Error('Invalid email or password. Please try again.'));
      }
    }, 500);
  });
};

// POST /api/auth/logout
export const logout = () => {
  localStorage.removeItem('ecoclean_token');
  localStorage.removeItem('ecoclean_user');
  return { success: true };
};

// GET /api/auth/profile
export const getCurrentUser = () => {
  try {
    const saved = localStorage.getItem('ecoclean_user');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to parse current user from localStorage', e);
    return null;
  }
};

// PUT /api/auth/profile
export const updateProfile = (userData) => {
  const currentUser = getCurrentUser() || {};
  const updatedUser = { ...currentUser, ...userData };
  localStorage.setItem('ecoclean_user', JSON.stringify(updatedUser));
  return updatedUser;
};

export const changePassword = async (oldPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!newPassword || newPassword.length < 6) {
        reject(new Error('New password must be at least 6 characters long'));
        return;
      }
      resolve({ success: true, message: 'Password updated successfully' });
    }, 400);
  });
};

export const authService = {
  mockUsers,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword
};

export default authService;
