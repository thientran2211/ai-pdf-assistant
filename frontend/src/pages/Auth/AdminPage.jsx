import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Shield, RefreshCw, BarChart3, Lock, Unlock, 
  ArrowLeft, UserCheck, UserX, Crown, Activity, Trash2
} from 'lucide-react';
import adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal';

const AdminPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    username: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getStats()
      ]);
      setUsers(usersData.data || []);
      setStats(statsData.data || {});
    } catch (error) {
      toast.error('Failed to load admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    setUpdatingId(userId);
    try {
      await adminService.updateUser(userId, updates);
      toast.success(t('admin.updateSuccess'));
      fetchData();
    } catch (error) {
      toast.error(error.message || t('admin.updateError'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = (userId, username) => {
    setDeleteModal({ isOpen: true, userId, username });
  };

  const handleDeleteConfirm = async () => {
    const { userId, username } = deleteModal;
    
    setUpdatingId(userId);
    try {
      await adminService.deleteUser(userId);
      toast.success(t('admin.deleteSuccess', { username }));
      fetchData();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(error.error || error.message || t('admin.deleteError'));
    } finally {
      setDeleteModal({ isOpen: false, userId: null, username: '' });
      setUpdatingId(null);
    }
  };

  const handleResetQuota = async (userId) => {
    if (!window.confirm(t('admin.resetQuotaConfirm'))) return;
    try {
      await adminService.resetUserQuota(userId);
      toast.success(t('admin.resetQuotaSuccess'));
      fetchData();
    } catch (error) {
      toast.error(t('admin.resetQuotaError'));
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
          <Crown className="w-3 h-3" />
          Admin
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">
        User
      </span>
    );
  };

  const getStatusBadge = (isBlocked) => {
    if (isBlocked) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700 border border-rose-200">
          <UserX className="w-3 h-3" />
          Blocked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
        <UserCheck className="w-3 h-3" />
        Active
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="page-container">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('admin.backToDashboard')}
          </button>
          
          <PageHeader title={t('admin.title')} className="mb-2" />
          <p className="text-slate-500 text-sm">
            {t('admin.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/25 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Users</p>
                  <p className="text-2xl font-semibold text-slate-900">{stats.totalUsers || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Documents</p>
                  <p className="text-2xl font-semibold text-slate-900">{stats.totalDocs || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-500/25 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Active (7 days)</p>
                  <p className="text-2xl font-semibold text-slate-900">{stats.activeUsers || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Section */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4 flex-wrap">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              {t('admin.userManagement')}
            </h3>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={t('admin.searchUsers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 h-9 px-3 pl-9 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">API Quota</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{user.username}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.isBlocked)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden max-w-[80px]">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(100, ((user.apiQuota?.usedToday || 0) / (user.apiQuota?.dailyLimit || 50)) * 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                          {user.apiQuota?.usedToday || 0} / {user.apiQuota?.dailyLimit || 50}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle Block */}
                        <button
                          onClick={() => handleUpdateUser(user._id, { isBlocked: !user.isBlocked })}
                          disabled={updatingId === user._id}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${
                            user.isBlocked 
                              ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                              : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                          }`}
                          title={user.isBlocked ? t('admin.unblockUser') : t('admin.blockUser')}
                        >
                          {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                        
                        {/* Reset Quota */}
                        <button
                          onClick={() => handleResetQuota(user._id)}
                          disabled={updatingId === user._id}
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50"
                          title="Reset API quota"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        
                        {/* Toggle Role */}
                        <button
                          onClick={() => handleUpdateUser(user._id, { 
                            role: user.role === 'admin' ? 'user' : 'admin' 
                          })}
                          disabled={updatingId === user._id}
                          className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all disabled:opacity-50"
                          title={user.role === 'admin' ? t('admin.removeAdmin') : t('admin.makeAdmin')}
                        >
                          <Shield className="w-4 h-4" />
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteUser(user._id, user.username)}
                          disabled={updatingId === user._id || user.role === 'admin'}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title={user.role === 'admin' ? t('admin.cannotDeleteAdmin') : 'Delete user permanently'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                {searchTerm ? 'No users match your search' : 'No users found'}
              </p>
            </div>
          )}
        </div>
        
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null, username: '' })}
        onConfirm={handleDeleteConfirm}
        username={deleteModal.username}
        loading={updatingId === deleteModal.userId}
      />
    </div>
  );
};

export default AdminPage;