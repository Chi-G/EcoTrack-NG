import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Bell, X, Moon, Sun } from 'lucide-react';
import OnlineStatus from '@/Components/OnlineStatus';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    if (!user) {
        return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-pulse text-emerald-500 font-bold tracking-widest">ECOTRACK SECURE SESSION...</div>
        </div>;
    }

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [toast, setToast] = useState(null);

    const [isDark, setIsDark] = useState(() => {
        // Initial state from localStorage or system preference
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDarkMode = () => setIsDark(!isDark);

    useEffect(() => {
        if (window.Echo && user) {
            const channel = window.Echo.private(`App.Models.User.${user.id}`);

            channel.notification((notification) => {
                setToast({
                    title: notification.title || 'New Notification',
                    message: notification.message || 'You have a new update.',
                    type: notification.type
                });

                router.reload({ only: ['auth'] });

                setTimeout(() => setToast(null), 5000);
            });

            return () => {
                window.Echo.leave(`App.Models.User.${user.id}`);
            };
        }
    }, [user?.id]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <OnlineStatus />

            {/* Real-time Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 20, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-4 left-1/2 z-[200] w-full max-w-sm"
                    >
                        <div className="mx-4 bg-white dark:bg-gray-800 border-l-4 border-emerald-500 shadow-2xl rounded-2xl p-4 flex items-start gap-4 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-black text-gray-900 dark:text-white truncate">{toast.title}</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{toast.message}</p>
                            </div>
                            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-[98%] px-4 sm:px-8 lg:px-12">
                    <div className="flex h-24 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-24 w-auto object-contain" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-6">
                            {/* Eco-Wealth Badge */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl cursor-pointer shadow-sm group"
                            >
                                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Eco Wealth</span>
                                    <span className="text-sm font-black text-emerald-900 dark:text-white leading-tight">
                                        {user.points?.toLocaleString() || 0} <span className="text-[10px] font-bold opacity-60">PTS</span>
                                    </span>
                                </div>
                            </motion.div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-emerald-500 rounded-2xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800/30 group"
                                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {isDark ? (
                                    <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                                ) : (
                                    <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                                )}
                            </button>

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="relative p-2 text-gray-400 hover:text-emerald-500 transition-colors focus:outline-none group">
                                            <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                            {user.unread_notifications_count > 0 && (
                                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse">
                                                    {user.unread_notifications_count > 9 ? '9+' : user.unread_notifications_count}
                                                </span>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="96">
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                            <span className="font-bold text-gray-900 dark:text-white">Notifications</span>
                                            {user.unread_notifications_count > 0 && (
                                                <button
                                                    onClick={() => router.post(route('api.notifications.mark-read'))}
                                                    className="text-xs text-emerald-600 hover:text-emerald-500 font-semibold"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {user.notifications?.length > 0 ? (
                                                user.notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.read_at ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <span className="font-bold text-sm text-gray-900 dark:text-gray-100 italic">
                                                                {notification.data.title}
                                                            </span>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                                {notification.data.message}
                                                            </p>
                                                            <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                                                                {new Date(notification.created_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Bell className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <p className="text-sm text-gray-500">No notifications yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(true)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {showingNavigationDropdown && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowingNavigationDropdown(false)}
                                className="fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm sm:hidden"
                            />

                            {/* Drawer Content */}
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 right-0 z-[70] w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl sm:hidden border-s border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex h-20 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
                                        <ApplicationLogo className="h-10 w-auto" />
                                        <button
                                            onClick={() => setShowingNavigationDropdown(false)}
                                            className="p-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto py-6 space-y-1">
                                        <div className="px-6 pb-4">
                                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Navigation</div>

                                            {/* Mobile Eco-Wealth Badge */}
                                            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl mb-6">
                                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                                    <Leaf className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Eco Wealth</span>
                                                    <span className="text-lg font-black text-emerald-900 dark:text-white leading-tight">
                                                        {user.points?.toLocaleString() || 0} <span className="text-[10px] font-bold opacity-60">PTS</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Mobile Theme Toggle */}
                                            <button
                                                onClick={toggleDarkMode}
                                                className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl transition-all mb-4"
                                            >
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Theme</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{isDark ? 'Light' : 'Dark'} Mode</span>
                                                </div>
                                            </button>
                                        </div>
                                        <ResponsiveNavLink
                                            href={route('dashboard')}
                                            active={route().current('dashboard')}
                                            className="px-6"
                                        >
                                            Dashboard
                                        </ResponsiveNavLink>
                                    </div>

                                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                        <div className="mb-4">
                                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                                {user.name}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500 truncate">
                                                {user.email}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <Link
                                                href={route('profile.edit')}
                                                className="block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                                            >
                                                Profile Settings
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="block w-full text-left text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                                            >
                                                Sign Out
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800">
                    <div className="mx-auto max-w-[98%] px-4 py-6 sm:px-8 lg:px-12">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
