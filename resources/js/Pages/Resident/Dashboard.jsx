import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    Truck,
    Camera,
    Recycle,
    Trophy,
    History,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Smartphone,
    TrendingUp,
    Calendar,
    MapPin,
    Clock,
    X,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import DashboardChart from '@/Components/DashboardChart';

export default function ResidentDashboard({ analytics }) {
    const { auth } = usePage().props;
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        balance: 0,
        level: { name: 'Eco Starter', level: 1, nextMilestone: 500 }
    });
    const [pickups, setPickups] = useState([]);
    const [categories, setCategories] = useState([]);
    const [centers, setCenters] = useState([]);
    const [isScheduling, setIsScheduling] = useState(false);
    const [schedulingLoading, setSchedulingLoading] = useState(false);
    const [newPickup, setNewPickup] = useState({ category_id: '', recycling_center_id: '', scheduled_at: '', weight_kg: '' });
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('08:00');
    const [selectedPickupForQR, setSelectedPickupForQR] = useState(null);

    const fileInputRef = useRef(null);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/waste-categories');
            setCategories(res.data || []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchCenters = async () => {
        try {
            const res = await axios.get('/api/recycling-centers');
            setCenters(res.data.data || res.data || []);
        } catch (err) {
            console.error('Failed to fetch centers:', err);
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [rewardsRes, pickupsRes] = await Promise.all([
                axios.get('/api/rewards/balance'),
                axios.get('/api/waste-pickups')
            ]);

            setStats(prev => ({
                ...prev,
                balance: rewardsRes.data.balance,
                level: determineLevel(rewardsRes.data.balance)
            }));

            setPickups(pickupsRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchCategories();
        fetchCenters();
    }, []);

    const handleSchedulePickup = async (e) => {
        e.preventDefault();
        setSchedulingLoading(true);
        try {
            await axios.post('/api/waste-pickups', {
                ...newPickup,
                scheduled_at: `${pickupDate} ${pickupTime}`
            });
            setIsScheduling(false);
            setScanResult(null);
            setNewPickup({ category_id: '', recycling_center_id: '', scheduled_at: '', weight_kg: '' });
            setPickupDate('');
            setPickupTime('08:00');
            fetchDashboardData();
        } catch (err) {
            console.error('Scheduling failed', err);
            alert('Failed to schedule pickup. Please check your inputs.');
        } finally {
            setSchedulingLoading(false);
        }
    };

    const getCategoryNameById = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : 'Unknown';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'assigned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const determineLevel = (points) => {
        if (points >= 5000) return { name: 'Emerald Master', level: 5, nextMilestone: 10000 };
        if (points >= 2000) return { name: 'Elite Recycler', level: 4, nextMilestone: 5000 };
        if (points >= 1000) return { name: 'Green Guardian', level: 3, nextMilestone: 2000 };
        if (points >= 500) return { name: 'Eco Enthusiast', level: 2, nextMilestone: 1000 };
        return { name: 'Eco Starter', level: 1, nextMilestone: 500 };
    };

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

    const handleConfirmFromScan = () => {
        if (!scanResult) return;
        setNewPickup(prev => ({
            ...prev,
            category_id: scanResult.category.id,
            weight_kg: scanResult.weight || ''
        }));
        setIsScheduling(true);
    };

    return (
        <AuthenticatedLayout
            header={null}
        >
            <Head title="Resident Dashboard" />

            <div className="py-6 sm:py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-[98%] px-4 sm:px-8 lg:px-12 space-y-8">

                    {/* Modern Hero Section */}
                    <div className="relative overflow-hidden rounded-[48px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl p-8 sm:p-12">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-widest"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </motion.div>

                                <div className="space-y-2">
                                    <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
                                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{auth.user.name.split(' ')[0]}!</span>
                                    </h1>
                                    <p className="text-lg text-gray-500 dark:text-gray-400 font-medium sm:whitespace-nowrap">
                                        You're making a real difference today. Keep up the great recycling streak!
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-6">
                                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[32px] border border-emerald-100 dark:border-emerald-800/30 flex flex-col items-center min-w-[100px]">
                                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                        {pickups.length}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pickups</div>
                                </div>
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[32px] border border-blue-100 dark:border-blue-800/30 flex flex-col items-center min-w-[100px]">
                                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                                        {pickups.reduce((acc, p) => acc + (parseFloat(p.weight_kg) || 0), 0).toFixed(1)}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">KG Saved</div>
                                </div>
                            </div>
                        </div>

                        {/* Background Decorative Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -translate-x-1/3 translate-y-1/3"></div>
                    </div>

                    {/* active Pickup Banner - Highly Visible */}
                    {pickups.filter(p => ['assigned', 'in_transit'].includes(p.status)).map(activePickup => (
                        <motion.div
                            key={`active-${activePickup.id}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 rounded-[32px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[24px] flex items-center justify-center border border-white/20">
                                    <Truck className="w-8 h-8 text-white animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Collector En Route</div>
                                    <h4 className="text-xl font-black">{activePickup.collector?.name || 'A Collector'} is coming!</h4>
                                    <p className="text-sm text-blue-100/80">Have your recyclables ready. Show the QR code when they arrive.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPickupForQR(activePickup)}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3"
                            >
                                <Smartphone className="w-5 h-5" />
                                Show QR Code
                            </button>
                        </motion.div>
                    ))}

                    {/* Welcome & Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-[40px] bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2 relative overflow-hidden"
                        >
                            <div className="relative z-10 flex justify-between items-end">
                                <div className="space-y-4 w-full mr-8">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Eco-Status</h3>
                                            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
                                                {stats.level.name}
                                                <span className="text-xs sm:text-sm font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Level {stats.level.level}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            Next Milestone: {Number(stats.level?.nextMilestone || 500).toLocaleString()} PTS
                                        </div>
                                    </div>

                                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((stats.balance / (stats.level?.nextMilestone || 500)) * 100, 100)}%` }}
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                        ></motion.div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[32px] border border-emerald-100 dark:border-emerald-800/30">
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-1">Eco Tokens</div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.balance?.toLocaleString()} <span className="text-xs opacity-40">ECT</span></div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[32px] border border-blue-100 dark:border-blue-800/30">
                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-1">Waste Diverted</div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">
                                        {Number(pickups.reduce((acc, p) => acc + (parseFloat(p.weight_kg) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-xs opacity-40">KG</span>
                                    </div>
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
                                <h4 className="text-xl font-bold">New Pickup</h4>
                                <p className="text-emerald-100/80 text-sm mt-1">Ready to recycle? Book a collector to your doorstep now.</p>
                            </div>
                            <button
                                onClick={() => setIsScheduling(true)}
                                className="mt-6 w-full py-4 bg-white text-emerald-600 hover:bg-emerald-50 backdrop-blur-md rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/20"
                            >
                                Schedule Now <ArrowRight className="w-4 h-4" />
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

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl space-y-2">
                                                    <div className="text-gray-500 text-sm font-medium">Estimated Value</div>
                                                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {scanResult.category.points_per_kg} pts <span className="text-xs font-normal text-gray-400">/kg</span>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl space-y-2 border border-blue-100/50 dark:border-blue-800/20">
                                                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Est. Weight</div>
                                                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {scanResult.weight || 0} <span className="text-xs font-normal text-gray-400">kg</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleConfirmFromScan}
                                                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
                                            >
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

                    {/* Analytics Section */}
                    {analytics && analytics.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Your Impact</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Waste collection trend over the last 7 days.</p>
                                </div>
                                <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-2xl">
                                    <div className="px-4 py-2 bg-white dark:bg-gray-800 text-emerald-600 rounded-xl text-xs font-black shadow-sm">Collection</div>
                                </div>
                            </div>
                            <DashboardChart data={analytics} />
                        </motion.div>
                    )}

                    {/* Recent Activity Timeline */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <History className="w-6 h-6 text-emerald-500" /> Recent Activity
                            </h3>
                            <Link href={route('resident.history')} className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                View Full History <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            {pickups.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {pickups.slice(0, 5).map((pickup) => (
                                        <div key={pickup.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                    <Recycle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-gray-900 dark:text-white truncate">
                                                        {pickup.category?.name || 'Waste'} Recycling
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(pickup.scheduled_at).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(pickup.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-50 sm:border-0 dark:border-gray-700">
                                                <div className="flex items-center gap-3 order-2 sm:order-1">
                                                    {['assigned', 'in_transit'].includes(pickup.status) && (
                                                        <button
                                                            onClick={() => setSelectedPickupForQR(pickup)}
                                                            className="px-3 py-1.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                                                        >
                                                            <Smartphone size={14} />
                                                            Show QR
                                                        </button>
                                                    )}
                                                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${getStatusColor(pickup.status)}`}>
                                                        {pickup.status.replace('_', ' ')}
                                                    </div>
                                                </div>

                                                <div className="text-left sm:text-right order-1 sm:order-2 min-w-[80px]">
                                                    <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">+{Number(pickup.points_awarded || 0).toLocaleString()} <span className="text-[10px] opacity-60">PTS</span></div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{Number(pickup.weight_kg || 0).toLocaleString()} kg</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto">
                                        <History className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <div className="text-gray-500">No recycling activity yet. Your future pickups will appear here!</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.button
                            whileHover={{ y: -5 }}
                            onClick={() => setIsScheduling(true)}
                            className="p-6 rounded-[32px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center gap-3 transition-shadow hover:shadow-lg"
                        >
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                                <Recycle className="text-blue-500" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">Schedule</span>
                        </motion.button>

                        <Link
                            href={route('resident.rewards')}
                            className="p-6 rounded-[32px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm block transition-all hover:shadow-lg group"
                        >
                            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Trophy className="text-orange-500" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">Rewards</span>
                            </motion.div>
                        </Link>

                        <Link
                            href={route('resident.history')}
                            className="p-6 rounded-[32px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm block transition-all hover:shadow-lg group"
                        >
                            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <History className="text-purple-500" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">History</span>
                            </motion.div>
                        </Link>

                        <Link
                            href={route('resident.stats')}
                            className="p-6 rounded-[32px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm block transition-all hover:shadow-lg group"
                        >
                            <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center gap-3">
                                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <TrendingUp className="text-emerald-500" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">Stats</span>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scheduling Modal */}
            <AnimatePresence>
                {isScheduling && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsScheduling(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                                            <Recycle className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">Schedule Pickup</h3>
                                    </div>
                                    <button
                                        onClick={() => setIsScheduling(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSchedulePickup} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Waste Category</label>
                                            <select
                                                required
                                                value={newPickup.category_id}
                                                onChange={(e) => setNewPickup({ ...newPickup, category_id: e.target.value })}
                                                className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold"
                                            >
                                                <option value="">Select category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.points_per_kg} pts/kg)</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Est. Weight (kg)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                placeholder="e.g. 2.5"
                                                value={newPickup.weight_kg}
                                                onChange={(e) => setNewPickup({ ...newPickup, weight_kg: e.target.value })}
                                                className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Recycling Center</label>
                                        <select
                                            required
                                            value={newPickup.recycling_center_id}
                                            onChange={(e) => setNewPickup({ ...newPickup, recycling_center_id: e.target.value })}
                                            className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold"
                                        >
                                            <option value="">Select a center near you</option>
                                            {centers.map(center => (
                                                <option key={center.id} value={center.id}>{center.name} ({center.address})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Pickup Date</label>
                                            <input
                                                required
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={pickupDate}
                                                onChange={(e) => setPickupDate(e.target.value)}
                                                className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Time (8am - 6pm)</label>
                                            <input
                                                required
                                                type="time"
                                                min="08:00"
                                                max="18:00"
                                                value={pickupTime}
                                                onChange={(e) => setPickupTime(e.target.value)}
                                                className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl flex items-center gap-4 border border-emerald-100 dark:border-emerald-800/30">
                                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="text-sm text-emerald-800 dark:text-emerald-300">
                                            A collector will be dispatched to your registered address in <b>{auth.user.address || 'your neighborhood'}</b>.
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={schedulingLoading}
                                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-lg transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
                                    >
                                        {schedulingLoading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" /> Scheduling...
                                            </>
                                        ) : (
                                            <>Confirm Booking <ArrowRight className="w-6 h-6" /></>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* QR Code Modal for Verification */}
            <AnimatePresence>
                {selectedPickupForQR && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPickupForQR(null)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-[48px] shadow-2xl overflow-hidden p-8 text-center space-y-8"
                        >
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Verification QR</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Show this to your collector to verify and complete the pickup.</p>
                            </div>

                            <div className="bg-white p-6 rounded-[40px] shadow-inner inline-block border-4 border-emerald-500/20">
                                <QRCodeSVG
                                    value={selectedPickupForQR.verification_token}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl">
                                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Pickup ID</div>
                                    <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">#{selectedPickupForQR.id}</div>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-3xl">
                                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Category</div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                        {selectedPickupForQR.category?.name || 'Waste'}
                                    </div>
                                </div>
                                <div className="col-span-2 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-3xl">
                                    <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Scheduled For</div>
                                    <div className="text-sm font-black text-gray-900 dark:text-white">
                                        {new Date(selectedPickupForQR.scheduled_at).toLocaleString([], {
                                            weekday: 'short', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedPickupForQR(null)}
                                className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
