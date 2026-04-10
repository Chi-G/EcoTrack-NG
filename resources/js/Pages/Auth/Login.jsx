import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { User, Truck, Recycle, ShieldCheck, Sparkles } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const { app_env, quick_login_credentials } = usePage().props;

    const handleQuickLogin = (role) => {
        const creds = quick_login_credentials[role];
        if (!creds) return;
        
        setData({
            ...data,
            email: creds.email,
            password: creds.password,
        });
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-secondary">Welcome Back</h2>
                <p className="text-text-muted mt-2">Log in to your EcoTrack portal</p>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-600">
                    {status}
                </div>
            )}

            {/* Quick Login Section */}
            <div className="mb-8 p-4 rounded-2xl bg-white/50 border border-emerald-100/50 backdrop-blur-sm shadow-sm group">
                <div className="flex items-center gap-2 mb-4 text-emerald-600">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">Quick Access ({app_env})</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleQuickLogin('resident')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 group/btn"
                    >
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-colors">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-secondary">Resident</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickLogin('collector')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 group/btn"
                    >
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-colors">
                            <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-secondary">Collector</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickLogin('recycler')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 group/btn"
                    >
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover/btn:bg-amber-600 group-hover/btn:text-white transition-colors">
                            <Recycle className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-secondary">Recycler</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickLogin('admin')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 group/btn"
                    >
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover/btn:bg-purple-600 group-hover/btn:text-white transition-colors">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-secondary">Admin</span>
                    </button>
                </div>
            </div>

            <form onSubmit={submit}>
                <div className="space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <InputLabel htmlFor="password" value="Password" />
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                className="rounded-md text-primary focus:ring-emerald-500"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-text-muted">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div className="pt-2">
                        <PrimaryButton className="w-full h-14" disabled={processing}>
                            Sign In
                        </PrimaryButton>
                    </div>

                    <p className="text-center text-sm text-text-muted">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="text-primary font-bold hover:text-primary-dark transition-colors"
                        >
                            Join EcoTrack
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
