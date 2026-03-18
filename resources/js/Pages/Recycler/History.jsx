import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    History,
    Recycle,
    Calendar,
    Clock,
    ChevronLeft,
    Truck,
    Package
} from 'lucide-react';

export default function RecyclerHistory({ auth, center, deliveries }) {
    const getStatusColor = (status) => {
        return 'bg-emerald-500/10 text-emerald-500';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('recycler.dashboard')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-400" />
                    </Link>
                    <div>
                        <h2 className="font-black text-2xl text-gray-900 dark:text-white tracking-tight">Inbound Logs</h2>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{center.name}</p>
                    </div>
                </div>
            }
        >
            <Head title="Inbound Logs" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/30 overflow-hidden backdrop-blur-sm shadow-sm"
                    >
                        <div className="p-8 border-b border-gray-100 dark:border-gray-700/30 flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <History className="w-6 h-6 text-emerald-500" />
                                Complete History
                                <span className="ml-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {deliveries.total} Logs
                                </span>
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-700/20 border-b border-gray-100 dark:border-gray-700/30">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Collector</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Resident Source</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Weight</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
                                    {deliveries.data.length > 0 ? deliveries.data.map((delivery) => (
                                        <tr key={delivery.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 font-bold text-xs uppercase tracking-tighter">
                                                        {delivery.collector?.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 dark:text-white block leading-tight">{delivery.collector?.name}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Collector</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-1">
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 block">{delivery.resident?.name}</span>
                                                    <span className="text-[10px] text-gray-400 block max-w-[150px] truncate">{delivery.resident?.address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                                        <Recycle className="w-3.5 h-3.5 text-emerald-500" />
                                                    </div>
                                                    <span className="font-bold text-gray-600 dark:text-gray-300 text-sm">
                                                        {delivery.category?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="font-black text-emerald-500 text-lg">{delivery.weight_kg} <span className="text-[10px] uppercase opacity-60">kg</span></span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(delivery.delivered_at).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1.5 mt-1"><Clock className="w-3 h-3" /> {new Date(delivery.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Processed
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-30">
                                                    <Package className="w-16 h-16" />
                                                    <p className="font-black text-sm uppercase tracking-widest">No Deliveries Logged Yet</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Area */}
                        {deliveries.links && deliveries.links.length > 3 && (
                            <div className="p-8 border-t border-gray-100 dark:border-gray-700/30 bg-gray-50/30 dark:bg-gray-900/10 flex justify-center gap-2">
                                {deliveries.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${link.active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
