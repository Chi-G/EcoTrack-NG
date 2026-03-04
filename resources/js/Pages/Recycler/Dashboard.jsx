import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function RecyclerDashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Recycler Dashboard
                </h2>
            }
        >
            <Head title="Recycler Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-[98%] sm:px-8 lg:px-12">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Welcome, Recycler! Manage your inventory and update pricing.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
