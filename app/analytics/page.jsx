'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Eye, Search, AlertTriangle, Download, Trash2, Calendar, Clock, Film, Tv } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AnalyticsPage() {
    const { getAnalytics, clearAnalytics, exportAnalytics } = useAnalytics();
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        setAnalytics(getAnalytics());
    }, []);

    if (!analytics) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading analytics...</div>
            </div>
        );
    }

    // Process data for charts
    const totalWatchTime = analytics.watchEvents.reduce((sum, e) => sum + (e.duration || 0), 0);
    const completedWatches = analytics.watchEvents.filter(e => e.completed).length;
    const totalViews = analytics.pageViews._total || 0;

    // Watch time by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
    });

    const watchTimeByDay = last7Days.map(date => {
        const dayEvents = analytics.watchEvents.filter(e => {
            const eventDate = new Date(e.timestamp).toISOString().split('T')[0];
            return eventDate === date;
        });
        return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            minutes: Math.round(dayEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / 60),
        };
    });

    // Content type distribution
    const movieCount = analytics.watchEvents.filter(e => e.type === 'movie').length;
    const tvCount = analytics.watchEvents.filter(e => e.type === 'tv').length;
    const contentTypes = [
        { name: 'Movies', value: movieCount, color: '#00ff88' },
        { name: 'TV Shows', value: tvCount, color: '#00cc66' },
    ];

    // Top searches
    const searchCounts = {};
    analytics.searches.forEach(s => {
        searchCounts[s.query] = (searchCounts[s.query] || 0) + 1;
    });
    const topSearches = Object.entries(searchCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([query, count]) => ({ query, count }));

    const handleClear = () => {
        if (confirm('Clear all analytics data? This cannot be undone.')) {
            clearAnalytics();
            setAnalytics(getAnalytics());
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            {/* Header */}
            <div className="bg-gradient-to-b from-[#00ff88]/10 to-black/0 border-b border-white/10">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00ff88] to-white bg-clip-text text-transparent">
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-400 text-lg">Your viewing insights and statistics</p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={exportAnalytics} variant="jungle" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export Data
                            </Button>
                            <Button onClick={handleClear} variant="glass" className="gap-2 text-red-500">
                                <Trash2 className="w-4 h-4" />
                                Clear Data
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={Eye}
                        label="Total Views"
                        value={totalViews}
                        color="text-[#00ff88]"
                    />
                    <StatCard
                        icon={Clock}
                        label="Watch Time"
                        value={`${Math.round(totalWatchTime / 60)}m`}
                        color="text-blue-400"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Completed"
                        value={completedWatches}
                        color="text-green-400"
                    />
                    <StatCard
                        icon={Search}
                        label="Searches"
                        value={analytics.searches.length}
                        color="text-purple-400"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Watch Time Chart */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#00ff88]" />
                            Watch Time (Last 7 Days)
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={watchTimeByDay}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                <XAxis dataKey="date" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="minutes" stroke="#00ff88" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Content Type Chart */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Film className="w-5 h-5 text-[#00ff88]" />
                            Content Type Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={contentTypes}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {contentTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Searches */}
                {topSearches.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Search className="w-5 h-5 text-[#00ff88]" />
                            Top Searches
                        </h3>
                        <div className="space-y-3">
                            {topSearches.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <span className="text-gray-300">{item.query}</span>
                                    <Badge variant="jungle">{item.count} searches</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Errors */}
                {analytics.errors.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Recent Errors ({analytics.errors.length})
                        </h3>
                        <div className="space-y-2">
                            {analytics.errors.slice(-5).reverse().map((error, index) => (
                                <div key={index} className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="text-red-400 font-semibold">{error.type}</span>
                                            <p className="text-sm text-gray-400 mt-1">{error.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(error.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {totalViews === 0 && (
                    <div className="text-center py-24">
                        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No analytics data yet</h3>
                        <p className="text-gray-500">Start watching content to see your insights!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{label}</span>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
        </div>
    );
}
