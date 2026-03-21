import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-[98%] space-y-6 sm:px-8 lg:px-12">
                    <div className="mb-4">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-xs hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors w-fit group"
                        >
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <ChevronLeft className="w-4 h-4" />
                            </div>
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-[32px] sm:p-8 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-[32px] sm:p-8 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-[32px] sm:p-8 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
