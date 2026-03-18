import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    MapPin,
    Plus,
    Truck,
    Users,
    Recycle,
    ChevronRight,
    Map as MapIcon,
    AlertCircle,
    Loader2,
    X,
    Edit,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function AdminCenters({ centers, filters = {} }) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingHub, setEditingHub] = useState(null);
    const [hubToDelete, setHubToDelete] = useState(null);
    const [activeTab, setActiveTab] = useState(filters.tab || 'list');

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const mapContainerStyle = {
        width: '100%',
        height: '600px',
        borderRadius: '40px'
    };

    const center_point = {
        lat: 6.5244,
        lng: 3.3792
    };

    // Placeholder for real center creation form
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
    });

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Recycling Centers</h2>}
        >
            <Head title="Manage Centers" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Network Infrastructure</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Managing {centers.length} recycling hubs via {activeTab === 'map' ? 'Geospatial View' : 'Inventory Grid'}.</p>
                        </div>
                        <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('list')}
                                className={`px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Inventory
                            </button>
                            <button
                                onClick={() => setActiveTab('map')}
                                className={`px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'map' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Operations Map
                            </button>
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-gray-900 dark:bg-emerald-600 hover:scale-105 text-white px-6 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
                        >
                            <Plus size={20} /> Add New Hub
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'list' ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {centers.map((center, i) => (
                                    <motion.div
                                        key={center.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-xl transition-all border-b-8 border-b-emerald-500"
                                    >
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                                                    <MapIcon size={28} />
                                                </div>
                                                <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    Active Hub
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{center.name}</h4>
                                                <div className="flex items-start gap-2 text-sm text-gray-500">
                                                    <MapPin size={16} className="shrink-0 mt-0.5" />
                                                    <span>{center.address}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700/50 text-center">
                                                    <div className="text-2xl font-black text-gray-900 dark:text-white">{center.collectors_count}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collectors</div>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700/50 text-center">
                                                    <div className="text-2xl font-black text-gray-900 dark:text-white">{center.recyclers_count}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Staff</div>
                                                </div>
                                            </div>

                                            <div className="pt-4 flex gap-2">
                                                {route().has('admin.users') ? (
                                                    <Link
                                                        href={route('admin.users', { center: center.id })}
                                                        className="flex-1 py-3 text-center text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl hover:bg-emerald-100 transition-colors"
                                                    >
                                                        View Team
                                                    </Link>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="flex-1 py-3 text-center text-xs font-black uppercase tracking-widest text-gray-400 bg-gray-50 dark:bg-gray-900/10 rounded-2xl cursor-not-allowed"
                                                    >
                                                        View Team
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setEditingHub(center)}
                                                    className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all"
                                                    title="Edit Hub"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setHubToDelete(center)}
                                                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                                                    title="Delete Hub"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="map"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-white dark:bg-gray-800 p-4 rounded-[48px] border border-gray-100 dark:border-gray-700 shadow-2xl relative overflow-hidden"
                            >
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={center_point}
                                        zoom={12}
                                        options={{
                                            styles: [
                                                {
                                                    featureType: "all",
                                                    elementType: "labels.text.fill",
                                                    stylers: [{ color: "#242f3e" }]
                                                },
                                                {
                                                    featureType: "water",
                                                    elementType: "geometry",
                                                    stylers: [{ color: "#e9e9e9" }]
                                                }
                                            ],
                                            disableDefaultUI: true,
                                            zoomControl: true,
                                        }}
                                    >
                                        {centers.map(center => (
                                            <Marker
                                                key={center.id}
                                                position={{
                                                    lat: parseFloat(center.latitude) || 6.5244,
                                                    lng: parseFloat(center.longitude) || 3.3792
                                                }}
                                                title={center.name}
                                                icon={{
                                                    url: "https://maps.google.com/mapfiles/ms/icons/emerald-dot.png", // Mock fallback
                                                    scaledSize: { width: 40, height: 40 }
                                                }}
                                            />
                                        ))}
                                    </GoogleMap>
                                ) : (
                                    <div className="h-[600px] flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                                        Loading Operations Map...
                                    </div>
                                )}

                                <div className="absolute bottom-10 left-10 right-10 flex justify-center">
                                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/20 flex gap-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-black uppercase text-gray-500">Active Hubs</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                            <span className="text-[10px] font-black uppercase text-gray-500">Live Logistics</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Edit Hub Modal */}
            <AnimatePresence>
                {editingHub && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingHub(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-[48px] shadow-2xl overflow-hidden"
                        >
                            <HubForm
                                hub={editingHub}
                                onClose={() => setEditingHub(null)}
                                mode="edit"
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Hub Confirmation */}
            <AnimatePresence>
                {hubToDelete && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setHubToDelete(null)}
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
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete Hub?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                                Deleting <span className="font-bold text-gray-900 dark:text-white">{hubToDelete.name}</span> will clear the territory for all assigned staff.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setHubToDelete(null)}
                                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        router.delete(route('admin.centers.delete', hubToDelete.id), {
                                            onSuccess: () => setHubToDelete(null),
                                        });
                                    }}
                                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Center Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-[48px] shadow-2xl overflow-hidden"
                        >
                            <HubForm onClose={() => setIsAdding(false)} mode="add" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}

function HubForm({ hub = null, onClose, mode = 'add' }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: hub?.name || '',
        address: hub?.address || '',
        latitude: hub?.latitude || '',
        longitude: hub?.longitude || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'edit') {
            put(route('admin.centers.update', hub.id), {
                onSuccess: () => onClose(),
            });
        } else {
            // Placeholder for add
            console.log('Add Hub Not Implemented Yet');
        }
    };

    return (
        <div className="p-10 space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {mode === 'edit' ? 'Refine Hub' : 'Expand Network'}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-700">
                    <X className="text-gray-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Hub Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="e.g. Lagos East Eco-Hub"
                        className="w-full h-14 px-8 bg-gray-50 dark:bg-gray-900 border-none rounded-3xl focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white"
                    />
                    {errors.name && <div className="text-red-500 text-xs px-4 mt-1">{errors.name}</div>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Address</label>
                    <input
                        type="text"
                        value={data.address}
                        onChange={e => setData('address', e.target.value)}
                        placeholder="Full street address..."
                        className="w-full h-14 px-8 bg-gray-50 dark:bg-gray-900 border-none rounded-3xl focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white"
                    />
                    {errors.address && <div className="text-red-500 text-xs px-4 mt-1">{errors.address}</div>}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Latitude</label>
                        <input
                            type="text"
                            value={data.latitude}
                            onChange={e => setData('latitude', e.target.value)}
                            placeholder="6.5244"
                            className="w-full h-14 px-8 bg-gray-50 dark:bg-gray-900 border-none rounded-3xl focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white"
                        />
                        {errors.latitude && <div className="text-red-500 text-xs px-4 mt-1">{errors.latitude}</div>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Longitude</label>
                        <input
                            type="text"
                            value={data.longitude}
                            onChange={e => setData('longitude', e.target.value)}
                            placeholder="3.3792"
                            className="w-full h-14 px-8 bg-gray-50 dark:bg-gray-900 border-none rounded-3xl focus:ring-2 focus:ring-emerald-500 font-bold dark:text-white"
                        />
                        {errors.longitude && <div className="text-red-500 text-xs px-4 mt-1">{errors.longitude}</div>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                    {processing ? <Loader2 className="animate-spin" size={24} /> : (mode === 'edit' ? 'Update Hub' : 'Create Hub')}
                </button>
            </form>
        </div>
    );
}
