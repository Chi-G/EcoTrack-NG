import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Users,
    Search,
    Filter,
    MapPin,
    Shield,
    Truck,
    User as UserIcon,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Recycle,
    Trash2,
    AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';

export default function AdminUsers({ users, centers, filters }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [center, setCenter] = useState(filters.center || '');

    const handleDelete = () => {
        if (!userToDelete) return;

        router.delete(route('admin.users.delete', userToDelete.id), {
            onSuccess: () => setUserToDelete(null),
        });
    };

    const { data, setData, post, processing, errors } = useForm({
        recycling_center_id: '',
    });

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        router.get(route('admin.users'), { search: value, role, center }, {
            preserveState: true,
            replace: true,
            only: ['users']
        });
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRole(value);
        router.get(route('admin.users'), { search, role: value, center }, {
            preserveState: true,
            replace: true,
            only: ['users']
        });
    };

    const clearCenterFilter = () => {
        setCenter('');
        router.get(route('admin.users'), { search, role }, {
            preserveState: true,
            replace: true,
            only: ['users']
        });
    };

    const handleAssign = (e) => {
        e.preventDefault();
        post(route('admin.users.assign-center', selectedUser.id), {
            onSuccess: () => setSelectedUser(null),
        });
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield size={16} className="text-red-500" />;
            case 'collector': return <Truck size={16} className="text-orange-500" />;
            case 'recycler': return <Recycle size={16} className="text-blue-500" />;
            default: return <UserIcon size={16} className="text-emerald-500" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">User Management</h2>}
        >
            <Head title="User Management" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Active Territory Indicator */}
                    {center && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                                    <MapPin size={16} />
                                </div>
                                <div>
                                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active Territory</span>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                        Filtering by: {centers.find(c => c.id == center)?.name || 'Facility Team'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={clearCenterFilter}
                                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                Clear Filter
                            </button>
                        </motion.div>
                    )}

                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search users by name or email..."
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={role}
                                onChange={handleRoleChange}
                                className="bg-white dark:bg-gray-800 border-none rounded-xl shadow-sm px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">All Roles</option>
                                <option value="resident">Resident</option>
                                <option value="collector">Collector</option>
                                <option value="recycler">Recycler</option>
                            </select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">User</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Assigned Center</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Joined</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
                                                {getRoleIcon(user.role)}
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {user.recycling_center ? (
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-emerald-500" />
                                                    <span className="font-medium text-gray-900 dark:text-white">{user.recycling_center.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {['collector', 'recycler'].includes(user.role) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setData('recycling_center_id', user.recycling_center_id || '');
                                                        }}
                                                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl"
                                                    >
                                                        Assign Center
                                                    </button>
                                                )}
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => setUserToDelete(user)}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-bold">{users.from}</span> to <span className="font-bold">{users.to}</span> of <span className="font-bold">{users.total}</span> users
                            </div>
                            <div className="flex gap-2">
                                {users.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${link.active
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-emerald-600 border border-gray-200 dark:border-gray-700'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-50 dark:bg-gray-900/50 text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-800 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {userToDelete && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setUserToDelete(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden p-8 text-center"
                        >
                            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <AlertCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete User?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                                Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">{userToDelete.name}</span>? This action is permanent.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setUserToDelete(null)}
                                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Assignment Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden p-8"
                        >
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Assign Center</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                Assign <span className="font-bold text-gray-900 dark:text-white">{selectedUser.name}</span> to a territory.
                            </p>

                            <form onSubmit={handleAssign} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Select Recycling Center</label>
                                    <select
                                        required
                                        value={data.recycling_center_id}
                                        onChange={e => setData('recycling_center_id', e.target.value)}
                                        className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold"
                                    >
                                        <option value="">Choose a center...</option>
                                        {centers.map(center => (
                                            <option key={center.id} value={center.id}>{center.name}</option>
                                        ))}
                                    </select>
                                    {errors.recycling_center_id && <div className="text-red-500 text-xs mt-1">{errors.recycling_center_id}</div>}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUser(null)}
                                        className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        {processing ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Assignment'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
