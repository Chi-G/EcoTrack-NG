import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

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
