import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    Box,
    MapPin,
    Clock,
    CheckCircle,
    ChevronRight,
    Navigation,
    Loader2,
    Calendar,
    Target,
    Bell,
    QrCode,
    X,
    Maximize2
} from 'lucide-react';
import { Html5Qrcode } from "html5-qrcode";
import axios from 'axios';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';

const LIBRARIES = ['places'];

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        in_transit: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '32px'
};

const defaultCenter = {
    lat: 6.5244, // Lagos default
    lng: 3.3792
};

export default function CollectorDashboard() {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ today_completed: 0, today_weight: 0, active_assigned: 0, pending_available: 0 });
    const [pickups, setPickups] = useState([]);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [map, setMap] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannerPickup, setScannerPickup] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES
    });

    const fetchDashboardData = async () => {
        try {
            const [statsRes, pickupsRes] = await Promise.all([
                axios.get('/api/collector/stats'),
                axios.get('/api/waste-pickups')
            ]);
            setStats(statsRes.data.data);
            setPickups(pickupsRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch collector data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Real-time Echo listeners
        if (window.Echo) {
            window.Echo.private(`App.Models.User.${auth.user.id}`)
                .notification((notification) => {
                    console.log('New Notification:', notification);
                    fetchDashboardData();
                });

            window.Echo.channel('pickups')
                .listen('.PickupScheduled', (e) => {
                    console.log('Pickup Scheduled Event:', e);
                    fetchDashboardData();
                });
        }

        return () => {
            if (window.Echo) {
                window.Echo.leave(`App.Models.User.${auth.user.id}`);
                window.Echo.leave('pickups');
            }
        };
    }, [auth.user.id]);

    const handleUpdateStatus = async (pickupId, newStatus) => {
        setUpdatingId(pickupId);
        try {
            await axios.patch(`/api/waste-pickups/${pickupId}`, {
                status: newStatus
            });
            await fetchDashboardData();
        } catch (err) {
            console.error('Status update failed:', err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleVerifyPickup = async (pickupId, token) => {
        setUpdatingId(pickupId);
        try {
            const res = await axios.patch(`/api/waste-pickups/${pickupId}/verify`, {
                token: token
            });
            if (res.data.success) {
                setIsScanning(false);
                setScannerPickup(null);
                await fetchDashboardData();
            }
        } catch (err) {
            console.error('Verification failed:', err);
            alert(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setUpdatingId(null);
        }
    };

    useEffect(() => {
        let html5QrCode;
        if (isScanning && scannerPickup) {
            html5QrCode = new Html5Qrcode("reader");
            const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

            html5QrCode.start(
                { facingMode: "environment" },
                qrConfig,
                (decodedText) => {
                    handleVerifyPickup(scannerPickup.id, decodedText);
                    html5QrCode.stop().catch(err => console.error("Failed to stop scanner", err));
                },
                (errorMessage) => {
                    // Ignore some errors
                }
            ).catch(err => {
                console.error("Failed to start scanner", err);
            });
        }
        return () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(err => console.error("Failed to stop scanner in cleanup", err));
            }
        };
    }, [isScanning, scannerPickup]);

    const availableJobs = pickups.filter(p => p.status === 'pending');
    const myActiveRoute = pickups.filter(p => p.collector_id === auth.user.id && p.status !== 'completed');

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Simulated coordinates for markers since DB might not have them yet
    const getCoordinates = (pickup) => {
        // Deterministic random offset base on pickup ID for demo if actual lat/lng missing
        const latOffset = (pickup.id % 100) / 1000;
        const lngOffset = (pickup.id % 50) / 1000;
        return {
            lat: defaultCenter.lat + latOffset,
            lng: defaultCenter.lng + lngOffset
        };
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Collector Dashboard" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Truck size={300} strokeWidth={1} />
                    </div>

                    <div className="max-w-[98%] mx-auto px-4 sm:px-8 lg:px-12 py-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs"
                                >
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Active Duty • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </motion.div>
                                <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
                                    Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Pickups?</span>
                                </h1>
                                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-xl">
                                    Welcome, {auth.user.name}. You have <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.pending_available} new pickups</span> nearby.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[32px] border border-emerald-100 dark:border-emerald-800/30 flex flex-col items-center min-w-[120px]">
                                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.today_completed}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Today's Jobs</div>
                                </div>
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[32px] border border-blue-100 dark:border-blue-800/30 flex flex-col items-center min-w-[120px]">
                                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.today_weight}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">KG Saved</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[98%] mx-auto px-4 sm:px-8 lg:px-12 mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Job Board (Available) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <Target className="text-emerald-500" size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Job Board</h3>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                                    <Bell size={12} className="text-emerald-600 dark:text-emerald-400 animate-bounce" />
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live Updates</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                                    </div>
                                ) : availableJobs.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 p-12 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700 text-center space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                                            <Calendar className="text-gray-300" size={32} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">All caught up!</p>
                                            <p className="text-sm text-gray-500">No new pickups available right now. Check back soon.</p>
                                        </div>
                                    </div>
                                ) : (
                                    availableJobs.map((pickup) => (
                                        <motion.div
                                            key={pickup.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                                        <Box size={28} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h4 className="font-black text-gray-900 dark:text-white">{pickup.category?.name || 'Recycables'}</h4>
                                                            <StatusBadge status={pickup.status} />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
                                                            from {pickup.resident?.name || 'Eco User'}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                            <div className="flex items-center gap-1.5 font-medium">
                                                                <Clock size={14} className="text-gray-400" />
                                                                {new Date(pickup.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 font-medium">
                                                                <MapPin size={14} className="text-gray-400" />
                                                                {pickup.resident?.address || 'Street Layout'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleUpdateStatus(pickup.id, 'assigned')}
                                                    disabled={updatingId === pickup.id}
                                                    className="p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all scale-100 active:scale-95 disabled:opacity-50"
                                                >
                                                    {updatingId === pickup.id ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Route & Map */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <Truck className="text-blue-500" size={20} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Live Route</h3>
                                <div className="ml-auto px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                    {myActiveRoute.length} Active
                                </div>
                            </div>

                            {/* Google Map Implementation */}
                            <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-2">
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={defaultCenter}
                                        zoom={13}
                                        onLoad={onLoad}
                                        onUnmount={onUnmount}
                                        options={{
                                            styles: [
                                                {
                                                    "featureType": "all",
                                                    "elementType": "labels.text.fill",
                                                    "stylers": [{ "color": "#746855" }]
                                                },
                                                {
                                                    "featureType": "water",
                                                    "elementType": "geometry.fill",
                                                    "stylers": [{ "color": "#c9c9c9" }]
                                                }
                                            ],
                                            disableDefaultUI: true,
                                            zoomControl: true,
                                        }}
                                    >
                                        {myActiveRoute.map(pickup => (
                                            <MarkerF
                                                key={pickup.id}
                                                position={getCoordinates(pickup)}
                                                onClick={() => setSelectedPickup(pickup)}
                                                icon={{
                                                    url: pickup.status === 'in_transit'
                                                        ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                                        : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                                }}
                                            />
                                        ))}

                                        {selectedPickup && (
                                            <InfoWindow
                                                position={getCoordinates(selectedPickup)}
                                                onCloseClick={() => setSelectedPickup(null)}
                                            >
                                                <div className="p-2">
                                                    <h4 className="font-bold text-gray-900">{selectedPickup.resident?.name || 'Recycler'}</h4>
                                                    <p className="text-xs text-gray-500">{selectedPickup.category?.name}</p>
                                                    <button
                                                        className="mt-2 text-[10px] font-bold text-emerald-600 uppercase"
                                                        onClick={() => setSelectedPickup(null)}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </InfoWindow>
                                        )}
                                    </GoogleMap>
                                ) : (
                                    <div style={mapContainerStyle} className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8 text-center gap-4">
                                        {loadError ? (
                                            <>
                                                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500">
                                                    <AlertTriangle size={24} />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">API Activation Required</p>
                                                    <p className="text-[10px] text-gray-500 max-w-[240px] leading-relaxed">
                                                        The Maps JavaScript API is not enabled for this project. Please enable it in the Google Cloud Console.
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Loader2 className="animate-spin text-blue-500" size={32} />
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Map Interface Offline</p>
                                                    <p className="text-[10px] text-gray-500 max-w-[200px]">Ensure your Google Maps API key is configured in the environment settings.</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Active Job Cards */}
                            <div className="space-y-4">
                                {myActiveRoute.length === 0 ? (
                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-[40px] border border-blue-100 dark:border-blue-900/30 text-center">
                                        <p className="text-blue-600 dark:text-blue-400 font-bold">No active jobs</p>
                                        <p className="text-xs text-blue-500/70 mt-1">Accept a pickup from the board to start your route.</p>
                                    </div>
                                ) : (
                                    myActiveRoute.map(pickup => (
                                        <div key={pickup.id} className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 p-6 shadow-sm overflow-hidden relative">
                                            {pickup.status === 'in_transit' && (
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                                            )}

                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <StatusBadge status={pickup.status} />
                                                    <h4 className="mt-2 text-lg font-black text-gray-900 dark:text-white">
                                                        {pickup.resident?.name || 'Eco User'}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                                        {pickup.category?.name} • {pickup.weight_kg}kg
                                                    </p>
                                                </div>
                                                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-[20px] flex items-center justify-center text-gray-400">
                                                    <Navigation size={24} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {pickup.status === 'assigned' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(pickup.id, 'in_transit')}
                                                        disabled={updatingId === pickup.id}
                                                        className="col-span-2 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                                                    >
                                                        <Navigation size={16} />
                                                        Begin Navigation
                                                    </button>
                                                )}
                                                {pickup.status === 'in_transit' && (
                                                    <button
                                                        onClick={() => {
                                                            setScannerPickup(pickup);
                                                            setIsScanning(true);
                                                        }}
                                                        disabled={updatingId === pickup.id}
                                                        className="col-span-2 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
                                                    >
                                                        <QrCode size={16} />
                                                        Scan QR to Verify
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Scanner Modal */}
            <AnimatePresence>
                {isScanning && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsScanning(false)}
                            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-[48px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                                            <QrCode size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Verify Pickup</h3>
                                            <p className="text-xs text-gray-500">Scan resident's QR code</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsScanning(false)}
                                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                <div className="relative aspect-square bg-black rounded-[32px] overflow-hidden border-4 border-emerald-500/20">
                                    <div id="reader" className="w-full h-full" />
                                    {/* Scanning Overlay */}
                                    <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40" />
                                    <motion.div
                                        animate={{ top: ['10%', '90%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)]"
                                    />
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-3xl text-center">
                                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                        Position the QR code within the frame to verify collection for <span className="text-emerald-600 font-black">{scannerPickup?.resident?.name}</span>.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
