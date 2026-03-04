import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowUpRight, ArrowDownLeft, Wallet, ChevronLeft, Gift, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RewardsPage() {
    const [data, setData] = useState({ balance: 0, transactions: { data: [] } });
    const [loading, setLoading] = useState(true);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [redeemAmount, setRedeemAmount] = useState(100);
    const [redeemLoading, setRedeemLoading] = useState(false);
    const [redeemSuccess, setRedeemSuccess] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/rewards/balance');
            setData(res.data);
        } catch (err) {
            console.error('Failed to fetch rewards data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRedeem = async (e) => {
        e.preventDefault();
        setRedeemLoading(true);
        try {
            await axios.post('/api/rewards/redeem', {
                points: redeemAmount,
                type: 'eco-cash'
            });
            setRedeemSuccess(true);
            setTimeout(() => {
                setIsRedeeming(false);
                setRedeemSuccess(false);
                fetchData();
            }, 2000);
        } catch (err) {
            alert(err.response?.data?.message || 'Redemption failed');
        } finally {
            setRedeemLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Eco Rewards</h2>}
        >
            <Head title="Rewards" />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mx-auto max-w-[98%] px-4 sm:px-8 lg:px-12 space-y-8">
                    <Link href={route('resident.dashboard')} className="flex items-center gap-2 text-emerald-600 font-bold hover:underline mb-4">
                        <ChevronLeft className="w-5 h-5" /> Back to Dashboard
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Balance Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-1 bg-emerald-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-500/20"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <Wallet className="w-12 h-12 mb-6 text-emerald-200" />
                            <div className="space-y-1">
                                <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-widest">Total Balance</h3>
                                <div className="text-6xl font-black">{data.balance.toLocaleString()}</div>
                                <div className="text-emerald-200 font-medium">Eco Tokens (ECT)</div>
                            </div>
                            <button
                                onClick={() => setIsRedeeming(true)}
                                className="mt-10 w-full py-5 bg-white text-emerald-600 rounded-3xl font-black text-lg transition-all hover:bg-emerald-50 shadow-xl flex items-center justify-center gap-2"
                            >
                                Redeem Now <Gift className="w-6 h-6" />
                            </button>
                        </motion.div>

                        {/* Recent Transactions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="p-10 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                    <Trophy className="w-8 h-8 text-orange-400" /> Transaction History
                                </h3>
                            </div>

                            {loading ? (
                                <div className="p-20 text-center">
                                    <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-500">Fetching your tokens...</p>
                                </div>
                            ) : data.transactions.data.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {data.transactions.data.map((tx) => (
                                        <div key={tx.id} className="p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 ${tx.transaction_type === 'earned' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} dark:bg-gray-700 rounded-2xl flex items-center justify-center`}>
                                                    {tx.transaction_type === 'earned' ? <ArrowUpRight className="w-7 h-7" /> : <ArrowDownLeft className="w-7 h-7" />}
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">{tx.description || tx.transaction_type}</div>
                                                    <div className="text-sm text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className={`text-xl font-black ${tx.transaction_type === 'earned' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {tx.transaction_type === 'earned' ? '+' : '-'}{tx.points.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 text-center text-gray-500">
                                    No reward transactions yet.
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Redemption Modal */}
            <AnimatePresence>
                {isRedeeming && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !redeemLoading && setIsRedeeming(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700"
                        >
                            <div className="p-8">
                                {redeemSuccess ? (
                                    <div className="text-center py-10 space-y-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600"
                                        >
                                            <CheckCircle2 className="w-12 h-12" />
                                        </motion.div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Redemption Successful!</h3>
                                            <p className="text-gray-500">Your points have been converted to Eco-Cash.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                                                    <Gift className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Redeem Points</h3>
                                            </div>
                                            <button
                                                onClick={() => setIsRedeeming(false)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                            >
                                                <X className="w-6 h-6 text-gray-400" />
                                            </button>
                                        </div>

                                        <form onSubmit={handleRedeem} className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Redemption Type</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 cursor-pointer">
                                                        <div className="font-bold text-emerald-900 dark:text-emerald-100">Eco-Cash</div>
                                                        <div className="text-xs text-emerald-600">100 pts = $1.00</div>
                                                    </div>
                                                    <div className="p-4 rounded-2xl border-2 border-transparent bg-gray-50 dark:bg-gray-900 opacity-50 cursor-not-allowed">
                                                        <div className="font-bold text-gray-400">Voucher</div>
                                                        <div className="text-xs">Coming soon</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Amount to Redeem</label>
                                                <input
                                                    required
                                                    type="number"
                                                    min="100"
                                                    step="100"
                                                    value={redeemAmount}
                                                    onChange={(e) => setRedeemAmount(e.target.value)}
                                                    className="w-full h-14 px-6 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold"
                                                />
                                                <div className="text-xs text-gray-500 pl-2">Available: {data.balance.toLocaleString()} ECT</div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={redeemLoading || data.balance < redeemAmount}
                                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-lg transition-all shadow-xl disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-3"
                                            >
                                                {redeemLoading ? (
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <>Confirm Redemption</>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
