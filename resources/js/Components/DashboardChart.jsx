import { useState, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function DashboardChart({ data, mode = 'collection' }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isMounted) return <div style={{ height: 300 }} />;

    const dataKey = mode === 'collection' ? 'waste' : 'points';
    const strokeColor = mode === 'collection' ? '#10b981' : '#3b82f6';
    const gradientId = mode === 'collection' ? 'colorWaste' : 'colorPoints';
    const label = mode === 'collection' ? 'Waste Collection (kg)' : 'Points Earned';

    return (
        <div className="h-[300px] w-full mt-6 relative overflow-hidden">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={strokeColor}
                        strokeWidth={4}
                        fillOpacity={1}
                        fill={`url(#${gradientId})`}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
