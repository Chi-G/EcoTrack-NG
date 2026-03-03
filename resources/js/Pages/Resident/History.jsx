import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { History, Recycle, Calendar, Clock, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HistoryPage() {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/waste-pickups')
            .then(res => setPickups(res.data.data || []))
            .finally(() => setLoading(false));
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30';
            case 'assigned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30';
            case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Recycling History</h2>}
        >
            <Head title="History" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <Link href={route('resident.dashboard')} className="flex items-center gap-2 text-emerald-600 font-bold hover:underline mb-4">
                        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <History className="w-8 h-8 text-emerald-500" /> Full History
                            </h3>
                        </div>

                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading your activities...</p>
                            </div>
                        ) : pickups.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {pickups.map((pickup) => (
                                    <div key={pickup.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-3xl flex items-center justify-center">
                                                <Recycle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {pickup.category?.name || 'Waste'} Recycling
                                                </div>
                                                <div className="text-gray-500 flex items-center gap-4 mt-1">
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(pickup.scheduled_at).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(pickup.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">+{pickup.points_awarded || 0} pts</div>
                                                <div className="text-sm font-bold text-gray-400">{pickup.weight_kg || '—'} kg collected</div>
                                            </div>
                                            <div className={`px-6 py-2 rounded-2xl text-sm font-black uppercase tracking-widest ${getStatusColor(pickup.status)}`}>
                                                {pickup.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto">
                                    <History className="w-12 h-12 text-gray-200" />
                                </div>
                                <div className="text-gray-500 max-w-sm mx-auto">You haven't scheduled any recycling pickups yet. Start today and earn rewards!</div>
                                <Link href={route('resident.dashboard')} className="inline-block mt-4 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20">
                                    Schedule Your First Pickup
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
