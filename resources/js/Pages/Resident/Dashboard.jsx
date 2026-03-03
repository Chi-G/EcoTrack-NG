import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    Camera,
    Recycle,
    Trophy,
    History,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Smartphone,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ResidentDashboard() {
    const { auth } = usePage().props;
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setScanning(true);
        setScanResult(null);
        setError(null);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;

            try {
                const response = await axios.post('/api/waste/classify', {
                    image: base64Image
                });

                if (response.data.success) {
                    setScanResult(response.data);
                } else {
                    setError('Unable to classify this item. Try again with a clearer photo.');
                }
            } catch (err) {
                console.error(err);
                setError('Classification service error. Using fallback classification.');
            } finally {
                setScanning(false);
            }
        };
    };

    const triggerScanner = () => {
        fileInputRef.current?.click();
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    EcoTrack-NG Resident Dashboard
                </h2>
            }
        >
            <Head title="Resident Dashboard" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Welcome & Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-[40px] bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2 relative overflow-hidden"
                        >
                            <div className="relative z-10 flex justify-between items-center">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Hello, {auth.user.name.split(' ')[0]}! 👋
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Your environmental contribution is making a difference today.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Level 4 Recycler</div>
                                    <div className="text-xs text-gray-400">Next level at 5,000 pts</div>
                                </div>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                                    <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Eco Points</div>
                                    <div className="text-2xl font-black text-emerald-900 dark:text-white">1,250</div>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-3xl border border-orange-100 dark:border-orange-800">
                                    <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">Rewards Pending</div>
                                    <div className="text-2xl font-black text-orange-900 dark:text-white">₦4,500</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-emerald-600 rounded-[40px] p-8 text-white relative overflow-hidden flex flex-col justify-between"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <Trophy className="w-10 h-10 mb-4 text-emerald-300" />
                                <h4 className="text-xl font-bold">Top Contributor</h4>
                                <p className="text-emerald-100/80 text-sm mt-1">You are in the top 5% of residents in your district.</p>
                            </div>
                            <button className="mt-6 w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/20">
                                View Leaderboard <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Main Action: AI Scanner */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Camera className="w-6 h-6 text-emerald-500" /> AI Waste Scanner
                            </h3>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                onClick={triggerScanner}
                                className="relative h-[400px] rounded-[50px] bg-slate-900 overflow-hidden cursor-pointer group shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept="image/*"
                                    capture="environment"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/40 to-transparent"></div>

                                <div className="relative z-10 text-center space-y-4">
                                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border border-white/20 group-hover:scale-110 transition-transform duration-500">
                                        <Camera className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-2xl font-black text-white">Scan & Recyle</div>
                                        <div className="text-emerald-300 text-sm font-medium">AI-powered instant classification</div>
                                    </div>
                                </div>

                                {/* Animated Scanning Line */}
                                {scanning && (
                                    <motion.div
                                        initial={{ top: 0 }}
                                        animate={{ top: '100%' }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] z-20"
                                    />
                                )}
                            </motion.div>
                        </div>

                        {/* Scan Results Panel */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <History className="w-6 h-6 text-emerald-500" /> Classification Result
                            </h3>
                            <div className="min-h-[400px] rounded-[50px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 shadow-sm flex flex-col relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {scanning ? (
                                        <motion.div
                                            key="scanning"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex-1 flex flex-col items-center justify-center space-y-4"
                                        >
                                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                                            <div className="text-lg font-bold text-gray-500">AI is analyzing your waste...</div>
                                        </motion.div>
                                    ) : scanResult ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex-1 space-y-8"
                                        >
                                            <div className="flex items-start gap-4 p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[32px] border border-emerald-100 dark:border-emerald-800/50">
                                                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center">
                                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Matched Category</div>
                                                    <div className="text-3xl font-black text-gray-900 dark:text-white">{scanResult.category.name}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm font-bold uppercase text-gray-400">
                                                    <span>AI Confidence</span>
                                                    <span>{Math.round(scanResult.confidence * 100)}%</span>
                                                </div>
                                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${scanResult.confidence * 100}%` }}
                                                        className="h-full bg-emerald-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl space-y-2">
                                                <div className="text-gray-500 text-sm font-medium">Estimated Value:</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                    {scanResult.category.points_per_kg} pts <span className="text-sm font-normal text-gray-400">/ per kg</span>
                                                </div>
                                            </div>

                                            <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all">
                                                Confirm & Schedule Pickup
                                            </button>
                                        </motion.div>
                                    ) : error ? (
                                        <motion.div
                                            key="error"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                                        >
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                                <AlertCircle className="w-10 h-10 text-red-500" />
                                            </div>
                                            <div>
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">Classification Failed</div>
                                                <div className="text-gray-500">{error}</div>
                                            </div>
                                            <button
                                                onClick={triggerScanner}
                                                className="px-6 py-2 text-emerald-600 font-bold hover:bg-emerald-50 rounded-xl transition-all"
                                            >
                                                Try Again
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                <Smartphone className="w-10 h-10 text-slate-400" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">Waiting for Scan</div>
                                                <p className="text-gray-500 text-sm max-w-[200px]">Unlock rewards by scanning your recyclables.</p>
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>

                                {/* Background Glass Effect */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 -z-10"></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <Recycle className="text-blue-500" />, label: 'Schedule', color: 'blue' },
                            { icon: <Trophy className="text-orange-500" />, label: 'Rewards', color: 'orange' },
                            { icon: <History className="text-purple-500" />, label: 'History', color: 'purple' },
                            { icon: <TrendingUp className="text-emerald-500" />, label: 'Stats', color: 'emerald' },
                        ].map((action, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ y: -5 }}
                                className={`p-6 rounded-[32px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-3 transition-shadow hover:shadow-lg`}
                            >
                                <div className={`w-14 h-14 bg-${action.color}-50 dark:bg-${action.color}-900/20 rounded-2xl flex items-center justify-center`}>
                                    {action.icon}
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
