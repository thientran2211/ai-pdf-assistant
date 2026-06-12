import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.ADMIN.USERS);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const response = await axiosInstance.put(
      API_PATHS.ADMIN.UPDATE_USER(userId),
      updates
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update user' };
  }
};

export const resetUserQuota = async (userId) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.ADMIN.RESET_QUOTA(userId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset quota' };
  }
};

export const getStats = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.ADMIN.STATS);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch stats' };
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`${API_PATHS.ADMIN.UPDATE_USER(userId)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete user' };
  }
};

const adminService = {
  getUsers,
  updateUser,
  resetUserQuota,
  getStats,
  deleteUser
};

export default adminService;