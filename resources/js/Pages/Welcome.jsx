import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Recycle,
    Truck,
    Smartphone,
    BarChart3,
    ArrowRight,
    CheckCircle2,
    Globe,
    Award,
    TrendingUp,
    MapPin
} from 'lucide-react';

export default function Welcome({ auth }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const features = [
        {
            icon: <Smartphone className="w-8 h-8 text-primary" />,
            title: "Smart Pickups",
            description: "AI-powered scheduling and real-time tracking for hassle-free waste collection."
        },
        {
            icon: <Recycle className="w-8 h-8 text-primary" />,
            title: "Waste Classification",
            description: "Snap a photo and our AI automatically categorizes your waste for optimal recycling."
        },
        {
            icon: <Award className="w-8 h-8 text-primary" />,
            title: "Token Rewards",
            description: "Earn digital tokens for every kilogram of waste recycled. Redeem for cash or services."
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-primary" />,
            title: "Impact Analytics",
            description: "Track your environmental footprint with detailed recycling statistics and reports."
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Head title="EcoTrack-NG - Intelligent Waste Management" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-nav h-24 flex items-center justify-between px-6 lg:px-20">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center hover-scale">
                        <img src="/1-no-bg.png" alt="EcoTrack-NG Logo" className="w-24 h-24 object-contain" />
                    </Link>
                </div>

                <div className="flex items-center gap-8">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="text-secondary font-medium hover:text-primary transition-colors hover-scale"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="text-secondary font-medium hover:text-primary transition-colors hidden sm:block"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover-scale"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-20">
                <motion.div
                    className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 items-center"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div className="space-y-8">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Leading Nigeria's Circular Economy
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold leading-[1.1] text-secondary">
                            Modern Solution for <span className="text-gradient">Sustainable</span> Living
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl text-text-muted max-w-xl leading-relaxed">
                            Join thousands of households across Nigeria using AI to manage waste efficiently while earning rewards for protecting our environment.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href={route('register')}
                                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-lg text-center flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 hover-scale transition-all"
                            >
                                Start Recycling <ArrowRight className="w-5 h-5" />
                            </Link>
                            <div className="flex -space-x-4 items-center pl-4">
                                {[
                                    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&h=150&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?q=80&w=150&h=150&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?q=80&w=150&h=150&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=150&h=150&auto=format&fit=crop"
                                ].map((url, i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 overflow-hidden shadow-sm">
                                        <img src={url} alt="user" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="pl-6 text-sm font-medium text-text-muted">
                                    <span className="text-secondary font-bold">13k+</span> Citizens Joined
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="relative">
                        <div className="absolute -z-10 w-[500px] h-[500px] bg-emerald-300/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                        <div className="glass-card rounded-[40px] p-2 rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="/images/smart-bin.png"
                                alt="EcoTrack-NG Smart Recycling Node"
                                className="rounded-[36px] w-full aspect-square object-cover shadow-2xl"
                            />
                            <div className="absolute -bottom-8 -left-8 bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl flex items-center gap-4 animate-bounce duration-[3000ms] border border-emerald-500/40">
                                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                                    <TrendingUp className="text-emerald-400 w-8 h-8" />
                                </div>
                                <div className="pr-4 leading-tight">
                                    <div className="text-3xl font-black text-white">85%</div>
                                    <div className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider">Efficiency Boost</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="py-32 px-6 lg:px-20 bg-white/50 backdrop-blur-sm relative">
                <div className="max-w-[1440px] mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <h2 className="text-4xl lg:text-5xl font-bold text-secondary">Why Choose EcoTrack-NG?</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">We combine advanced AI with local Nigerian dynamics to solve the waste management crisis.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="glass-card p-8 rounded-[32px] space-y-6 hover:border-emerald-500/50 transition-all border-transparent"
                            >
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-secondary">{feature.title}</h3>
                                <p className="text-text-muted leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-32 px-6 lg:px-20">
                <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <img src="/images/recycling-facility.png" className="rounded-3xl w-full h-64 object-cover shadow-lg" alt="Automated Recycling Facility" />
                                <div className="glass-card p-6 rounded-3xl text-center">
                                    <div className="text-3xl font-bold text-primary">130+</div>
                                    <div className="text-sm text-text-muted">Tons Diverted</div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-12">
                                <div className="glass-card p-6 rounded-3xl text-center bg-secondary">
                                    <div className="text-3xl font-bold text-white">4.8/5</div>
                                    <div className="text-sm text-emerald-300">User Rating</div>
                                </div>
                                <img src="/images/smart-city-bin.png" className="rounded-3xl w-full h-64 object-cover shadow-lg" alt="City Resource Management" />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-bold text-secondary leading-tight">Every Action Creates a <span className="text-gradient">Positive Impact</span></h2>

                        <div className="space-y-6">
                            {[
                                { title: "Divert from Landfills", desc: "Reducing 13,000 tons of daily waste in Lagos state." },
                                { title: "Eco-Economic Empowerment", desc: "Generating income for collectors and savings for residents." },
                                { title: "AI-Driven Optimization", desc: "Reducing carbon emissions with optimized collection routes." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-secondary">{item.title}</h4>
                                        <p className="text-text-muted mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href={route('register')}
                            className="inline-flex items-center gap-4 text-primary font-bold text-lg group"
                        >
                            Learn More About Our Impact
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section - Waste to Wealth */}
            <section className="py-24 px-6 lg:px-20 mb-20 overflow-hidden">
                <div className="max-w-[1440px] mx-auto relative group">
                    {/* Decorative Background Glows */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full group-hover:bg-emerald-600/20 transition-all duration-700"></div>

                    <div className="relative z-10 bg-slate-900 rounded-[60px] lg:rounded-[100px] p-8 lg:p-20 overflow-hidden border border-white/5 shadow-2xl">
                        {/* Inner Gradient Mask */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-50"></div>

                        <div className="relative z-20 grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10 text-left">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm"
                                >
                                    <TrendingUp className="w-4 h-4" /> Eco-Economic Revolution
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-4xl lg:text-7xl font-black text-white leading-[1.1]"
                                >
                                    Turn Your <span className="text-emerald-400">Waste</span> <br />
                                    Into Digital <span className="text-emerald-400">Wealth</span>
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="text-xl text-slate-300 max-w-xl leading-relaxed font-medium"
                                >
                                    Join Nigeria's smartest recycling network. Earn tokens for every gram you recycle and watch your impact grow in real-time.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col sm:flex-row gap-6"
                                >
                                    <Link
                                        href={route('register')}
                                        className="bg-emerald-500 text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover-scale text-center"
                                    >
                                        Start Earning Now
                                    </Link>
                                    <Link
                                        href="#"
                                        className="flex items-center justify-center gap-3 text-white font-bold group/btn"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:bg-white/10 transition-all">
                                            <Smartphone className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        Get Mobile App
                                    </Link>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full animate-pulse"></div>
                                <div className="relative glass-card-solid p-4 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src="/images/waste-to-wealth.png"
                                        alt="Waste to Wealth Token"
                                        className="w-full rounded-[32px] transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {/* Overlay Stat */}
                                    <div className="absolute bottom-10 left-10 right-10 p-6 glass-card-solid rounded-3xl border border-emerald-500/30 flex items-center justify-between">
                                        <div>
                                            <div className="text-slate-800 text-xs font-bold uppercase tracking-widest">Token Earnings</div>
                                            <div className="text-3xl font-black text-slate-900">+2,450 ECO</div>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                            <CheckCircle2 className="text-emerald-600 w-8 h-8" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 lg:px-20 border-t border-gray-100 bg-white">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center">
                        <img src="/1-no-bg.png" alt="EcoTrack-NG Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <p className="text-text-muted text-sm text-center">© 2026 Forahia Enterprise. Building a sustainable Africa.</p>
                    <div className="flex gap-8 text-sm font-medium text-text-muted">
                        <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
