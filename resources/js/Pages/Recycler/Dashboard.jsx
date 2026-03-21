import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    Factory,
    TrendingUp,
    Scale,
    Truck,
    Calendar,
    ArrowUpRight,
    MapPin,
    Package,
    Clock,
    CheckCircle2,
    Loader2,
    Users
} from 'lucide-react';

export default function Dashboard({ auth, center, inventory, recentDeliveries, pendingDeliveries, stats }) {
    const [finishingId, setFinishingId] = useState(null);

    const handleConfirmReceipt = (id) => {
        setFinishingId(id);
        router.patch(`/api/waste-pickups/${id}/delivered`, {}, {
            onSuccess: () => setFinishingId(null),
            onError: () => setFinishingId(null),
        });
    };
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (!center) {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Recycler Dashboard</h2>}
            >
                <Head title="Recycler Dashboard" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-12 text-center">
                            <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Center Assigned</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                You are not currently assigned to any recycling center. Please contact the administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-black text-3xl text-gray-900 dark:text-white tracking-tight">
                            Recycler Portal <span className="text-emerald-500">.</span>
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            {center.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none">Status</p>
                            <p className="text-sm font-bold text-emerald-500">Center Online</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Dashboard - ${center.name}`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="max-w-7xl mx-auto space-y-8"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div variants={item} className="bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <Scale className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">Live Weight</span>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    {stats.total_weight.toLocaleString()} <span className="text-lg font-bold opacity-40">kg</span>
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Total Waste Processed</p>
                            </div>
                        </motion.div>

                        <motion.div variants={item} className="bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Truck className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">Volume</span>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    {stats.total_pickups.toLocaleString()} <span className="text-lg font-bold opacity-40">deliveries</span>
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Confirmed Inbound Logistics</p>
                            </div>
                        </motion.div>

                        <motion.div variants={item} className="bg-white dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-gray-700/50 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">Growth</span>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    +12.5 <span className="text-lg font-bold opacity-40">%</span>
                                </h3>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Processing Efficiency</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Inventory Breakdown */}
                        <motion.div variants={item} className="lg:col-span-1 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                    <Package className="w-5 h-5 text-emerald-500" />
                                    Inventory
                                </h3>
                                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 transition-colors">See Details</button>
                            </div>

                            <div className="space-y-4">
                                {inventory.map((cat) => (
                                    <div key={cat.id} className="bg-white dark:bg-gray-800/40 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/30 hover:shadow-lg transition-all group">
                                        <div className="flex justify-between items-center mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{cat.name}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {cat.last_update ? `Last Inbound: ${new Date(cat.last_update).toLocaleDateString()}` : 'No activity'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-emerald-500">{Number(cat.total_weight || 0).toLocaleString()} <span className="text-[10px]">kg</span></p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700/50 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (cat.total_weight / (stats.total_weight || 1)) * 100)}%` }}
                                                className="bg-emerald-500 h-full rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent Deliveries Table */}
                        <motion.div variants={item} className="lg:col-span-2 space-y-8">
                            {/* Incoming Deliveries (Actionable) */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 px-2">
                                    <Truck className="w-5 h-5 text-blue-500" />
                                    Incoming Logistics
                                    <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {pendingDeliveries.length} Pending
                                    </span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pendingDeliveries.length > 0 ? pendingDeliveries.map((delivery) => (
                                        <div key={delivery.id} className="bg-white dark:bg-gray-800/40 p-6 rounded-[2rem] border border-blue-500/20 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 font-bold">
                                                        {delivery.collector?.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{delivery.collector?.name}</h4>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Collector</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-emerald-500">{delivery.weight_kg} kg</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase">{delivery.category?.name}</div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl mb-4 border border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                                    <MapPin className="w-3 h-3" />
                                                    Resident: {delivery.resident?.name} • {delivery.resident?.address}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleConfirmReceipt(delivery.id)}
                                                disabled={finishingId === delivery.id}
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {finishingId === delivery.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <><CheckCircle2 className="w-4 h-4" /> Confirm Receipt</>
                                                )}
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="col-span-2 bg-gray-50/50 dark:bg-gray-900/20 p-8 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700 text-center">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No incoming deliveries right now</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-emerald-500" />
                                        Inbound History
                                    </h3>
                                    <Link href={route('recycler.history')} className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 transition-colors">View All Logs</Link>
                                </div>

                                <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/30 overflow-hidden backdrop-blur-sm shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50/50 dark:bg-gray-700/20 border-b border-gray-100 dark:border-gray-700/30">
                                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Collector</th>
                                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Weight</th>
                                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Time</th>
                                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
                                                {recentDeliveries.length > 0 ? recentDeliveries.map((delivery) => (
                                                    <tr key={delivery.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-bold text-xs uppercase tracking-tighter">
                                                                    {delivery.collector?.name.charAt(0)}
                                                                </div>
                                                                <span className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{delivery.collector?.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 underline decoration-emerald-500/30 font-medium text-gray-600 dark:text-gray-300 italic text-sm">
                                                            {delivery.category?.name}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-black text-emerald-500">{delivery.weight_kg} kg</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                                {new Date(delivery.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                Verified
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-20 text-center">
                                                            <div className="flex flex-col items-center gap-2 opacity-30">
                                                                <Package className="w-10 h-10" />
                                                                <p className="font-black text-xs uppercase tracking-widest">No Deliveries Logged</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}

