import { Link } from '@inertiajs/react';
import { Recycle } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 relative overflow-hidden px-4">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
                <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-emerald-400 blur-[80px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-emerald-300 blur-[100px] rounded-full animate-pulse duration-[4000ms]"></div>
            </div>

            <div className="mt-12 mb-4 flex flex-col items-center">
                <Link href="/" className="hover-scale">
                    <img src="/1-no-bg.png" alt="EcoTrack-NG Logo" className="w-32 h-32 object-contain" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md glass-card rounded-[32px] p-8 lg:p-10">
                {children}
            </div>
        </div>
    );
}
