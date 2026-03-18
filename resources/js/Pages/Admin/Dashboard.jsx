import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Truck,
    Recycle,
    TrendingUp,
    MapPin,
    Clock,
    ArrowRight,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardChart from '@/Components/DashboardChart';

export default function AdminDashboard({ stats, recentPickups, centers, analytics }) {
    const [chartMode, setChartMode] = useState('collection');

    const statCards = [
        { label: 'Total Waste Collected', value: `${Number(stats.total_waste_kg || 0).toFixed(1)} kg`, icon: Recycle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Total Points Awarded', value: stats.total_points_awarded.toLocaleString(), icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Active Residents', value: stats.active_residents, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { label: 'Fleet Size', value: stats.active_collectors, icon: Truck, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Admin Control Center</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm"
                            >
                                <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                                <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Analytics Chart Section */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">System Analytics</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Historical {chartMode === 'collection' ? 'waste collection' : 'efficiency & award'} metrics.</p>
                            </div>
                            <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-900 rounded-[22px]">
                                <button
                                    onClick={() => setChartMode('collection')}
                                    className={`px-6 py-2.5 rounded-[18px] text-xs font-black transition-all cursor-pointer ${chartMode === 'collection' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-md transform scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800/50'}`}
                                >
                                    Collection
                                </button>
                                <button
                                    onClick={() => setChartMode('efficiency')}
                                    className={`px-6 py-2.5 rounded-[18px] text-xs font-black transition-all cursor-pointer ${chartMode === 'efficiency' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-md transform scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800/50'}`}
                                >
                                    Efficiency
                                </button>
                            </div>
                        </div>
                        <DashboardChart data={analytics} mode={chartMode} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Activity */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-emerald-500" /> Recent Activity
                                </h3>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors">
                                        <Search size={18} className="text-gray-400" />
                                    </button>
                                    <button className="p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors">
                                        <Filter size={18} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                                <div className="divide-y divide-gray-100 dark:divide-gray-700 flex-1">
                                    {recentPickups.length > 0 ? (
                                        recentPickups.map((pickup) => (
                                            <div key={pickup.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${pickup.status === 'completed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                                                        pickup.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                                                            'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                                        }`}>
                                                        <Recycle size={28} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-black text-gray-900 dark:text-white leading-tight">
                                                            {pickup.category?.name || 'Waste'} <span className="text-gray-400 font-bold tracking-tight">({pickup.weight_kg}kg)</span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                                                            <span className="flex items-center gap-1"><MapPin size={12} /> {pickup.recycling_center?.name}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(pickup.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right hidden sm:block">
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contributor</div>
                                                        <div className="text-sm font-black text-gray-900 dark:text-white">{pickup.resident?.name}</div>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${pickup.status === 'completed' ? 'bg-emerald-500 text-white' :
                                                        pickup.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-blue-600 text-white'
                                                        }`}>
                                                        {pickup.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center">
                                                <Recycle className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <p className="text-gray-400 font-bold">No recent logistics activity detected.</p>
                                        </div>
                                    )}
                                </div>
                                <Link
                                    href={route('admin.users', { role: 'collector' })}
                                    className="block p-5 bg-gray-50/50 dark:bg-gray-900/30 text-center text-sm font-black text-emerald-600 hover:text-emerald-700 transition-colors border-t border-gray-100 dark:border-gray-700 uppercase tracking-[0.2em]"
                                >
                                    View Detailed Logistics
                                </Link>
                            </div>
                        </div>

                        {/* Centers Overview - Reimagined as a cleaner list */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-emerald-500" /> Facility Status
                                </h3>
                                <Link href={route('admin.centers', { tab: 'map' })} className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    View Map
                                </Link>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {centers.slice(0, 5).map((center) => (
                                        <div key={center.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                                                        <MapPin size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-sm text-gray-900 dark:text-white leading-tight">{center.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{center.address.split(',')[0]}</div>
                                                    </div>
                                                </div>
                                                <div className="flex -space-x-2">
                                                    {[...Array(Math.min(center.collectors_count, 3))].map((_, i) => (
                                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                            <Users size={10} className="text-gray-400" />
                                                        </div>
                                                    ))}
                                                    {center.collectors_count > 3 && (
                                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-emerald-500 flex items-center justify-center text-[8px] font-bold text-white">
                                                            +{center.collectors_count - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Collectors</div>
                                                    <div className="text-sm font-black text-emerald-600 text-center">{center.collectors_count}</div>
                                                </div>
                                                <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Facility</div>
                                                    <div className="text-sm font-black text-blue-600 text-center">{center.recyclers_count}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href={route('admin.centers', { tab: 'list' })}
                                    className="block p-4 bg-gray-50/30 dark:bg-gray-900/30 text-center text-xs font-black text-gray-400 hover:text-emerald-500 transition-colors border-t border-gray-100 dark:border-gray-700 uppercase tracking-widest"
                                >
                                    Manage All Centers
                                </Link>
                            </div>

                            <Link
                                href={route('admin.centers', { tab: 'map' })}
                                className="w-full py-4 bg-emerald-600 text-white rounded-[32px] font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowRight className="w-4 h-4" /> Operations Map
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
