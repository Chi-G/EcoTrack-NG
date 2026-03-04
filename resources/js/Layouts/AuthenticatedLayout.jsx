import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <OnlineStatus />
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
