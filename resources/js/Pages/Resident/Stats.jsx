import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Leaf, Droplets, Zap, ChevronLeft, Globe } from 'lucide-react';

export default function StatsPage() {
    const stats = [
        { label: 'CO2 Offset', value: '124 kg', icon: <Globe className="text-blue-500" />, detail: 'Equivalent to 5 trees planted' },
        { label: 'Energy Saved', value: '450 kWh', icon: <Zap className="text-yellow-500" />, detail: 'Powers a home for 12 days' },
        { label: 'Water Conserved', value: '1,200 L', icon: <Droplets className="text-cyan-500" />, detail: 'Equivalent to 15 showers' },
        { label: 'Waste Diverted', value: '85 kg', icon: <Leaf className="text-emerald-500" />, detail: 'Total weight recycled' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Impact Statistics</h2>}
        >
            <Head title="Environmental Impact" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-[98%] px-4 sm:px-8 lg:px-12 space-y-8">
                    <Link href={route('resident.dashboard')} className="flex items-center gap-2 text-emerald-600 font-bold hover:underline mb-4">
                        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                    </Link>

                    <div className="bg-white dark:bg-gray-800 rounded-[40px] p-10 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                <TrendingUp className="w-10 h-10 text-emerald-500" /> Your Green Impact
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">See how your recycling efforts are literally saving the planet.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-center mb-6">
                                    {stat.icon}
                                </div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                <div className="text-4xl font-black text-gray-900 dark:text-white mb-3">{stat.value}</div>
                                <div className="text-sm text-gray-500 font-medium">{stat.detail}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-[50px] p-12 text-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent"></div>
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                            <div className="space-y-6 max-w-xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-emerald-300 font-bold text-sm">
                                    <BarChart3 className="w-4 h-4" /> Weekly Breakdown
                                </div>
                                <h4 className="text-4xl font-black italic">"Small steps lead to massive change."</h4>
                                <p className="text-gray-400 text-lg">In the last 7 days, you've improved your recycling efficiency by **12%**. You are currently ranked **#14** in your district.</p>
                            </div>
                            <div className="grid grid-cols-7 gap-3 items-end h-40 w-full lg:w-auto">
                                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                        className="w-8 bg-emerald-500 rounded-t-xl relative group"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {h}%
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
