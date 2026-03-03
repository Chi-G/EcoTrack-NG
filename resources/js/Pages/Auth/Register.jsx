import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'resident',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-secondary">Join EcoTrack</h2>
                <p className="text-text-muted mt-2">Start your sustainable journey today</p>
            </div>

            <form onSubmit={submit}>
                <div className="space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-2 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-2 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                            />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-2 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="Register As" />

                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="mt-2 block w-full border-gray-200 bg-white/50 backdrop-blur-sm rounded-xl focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        >
                            <option value="resident">Resident (Household/Business)</option>
                            <option value="collector">Waste Collector</option>
                            <option value="recycler">Recycling Center</option>
                        </select>

                        <InputError message={errors.role} className="mt-2" />
                    </div>

                    <div className="pt-4 space-y-4">
                        <PrimaryButton className="w-full h-14" disabled={processing}>
                            Create Account
                        </PrimaryButton>

                        <p className="text-center text-sm text-text-muted">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="text-primary font-bold hover:text-primary-dark transition-colors"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
