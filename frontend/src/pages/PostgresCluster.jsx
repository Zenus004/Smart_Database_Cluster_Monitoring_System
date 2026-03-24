import React, { useEffect, useState } from 'react';
import MetricCard from '../components/MetricCard';
import { getClusterStatus } from '../services/api';
import { Database, ArrowRight, Activity, Clock, Zap } from 'lucide-react';

const PostgresCluster = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getClusterStatus();
                setStatus(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch status", err);
                setError(err.message || "An unknown error occurred");
                setStatus(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center space-y-6 animate-fade-in">
                <div className="relative inline-block">
                    {/* Main spinner */}
                    <div className="w-20 h-20 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin mx-auto"
                        style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)' }}></div>

                    {/* Secondary spinner */}
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full mx-auto opacity-40"
                        style={{ animation: 'spin 1.5s linear infinite reverse' }}></div>

                    {/* Ping effect */}
                    <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-500/30 rounded-full animate-ping mx-auto"></div>

                    {/* Center glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-cyan-500/30 rounded-full blur-xl animate-pulse"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-slate-300 font-tech font-semibold text-lg tracking-wide">
                        Loading PostgreSQL Details
                    </p>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error || !status) return (
        <div className="max-w-3xl mx-auto mt-20 animate-slide-in-down">
            <div className="relative bg-gradient-to-br from-red-500/10 to-red-900/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                <p className="text-red-400 text-xl font-display font-semibold relative z-10">
                    Error: {error || 'Could not load data'}
                </p>
            </div>
        </div>
    );

    const master = status.postgres.find(n => n.role === 'primary');
    const replicas = status.postgres.filter(n => n.role === 'replica');

    return (
        <div className="space-y-8">
            {/* Enhanced Header */}
            <header className="animate-slide-in-down">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/40 shadow-lg group hover:scale-105 transition-transform duration-300">
                        <Database className="w-9 h-9 text-cyan-400 relative z-10 group-hover:rotate-12 transition-transform duration-300"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))' }} />
                        <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-2xl animate-pulse"></div>
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-2xl"
                            style={{ animation: 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 tracking-tight"
                            style={{ textShadow: '0 0 30px rgba(6, 182, 212, 0.3)' }}>
                            PostgreSQL Cluster
                        </h2>
                        <p className="text-slate-400 mt-1.5 font-tech tracking-wide">
                            Streaming Replication Topology
                        </p>
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-transparent animate-pulse"></div>
            </header>

            {/* Enhanced Topology Visual */}
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-md p-12 rounded-2xl border border-slate-700/50 shadow-2xl overflow-x-auto animate-fade-in">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                    animation: 'gridPulse 6s ease-in-out infinite'
                }}></div>

                {/* Enhanced background effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"
                    style={{ animationDuration: '12s' }}></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"
                    style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none opacity-30">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
                    <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-cyan-500 to-transparent"></div>
                </div>

                <div className="relative z-10 flex items-center justify-center gap-16 min-w-max pr-72 pl-8">
                    {/* Enhanced Master Node */}
                    <div className="relative group flex flex-col items-center animate-scale-in">
                        <div className="relative w-40 h-40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                            <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center border-4 ${master?.health === 'healthy'
                                ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 shadow-2xl'
                                : master?.health === 'warning'
                                    ? 'border-yellow-500/60 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 shadow-2xl'
                                    : 'border-red-500/60 bg-gradient-to-br from-red-500/20 to-red-600/10 shadow-2xl'
                                } z-10 backdrop-blur-md overflow-hidden`}
                                style={{
                                    boxShadow: master?.health === 'healthy'
                                        ? '0 0 40px rgba(16, 185, 129, 0.4), inset 0 0 30px rgba(16, 185, 129, 0.1)'
                                        : master?.health === 'warning'
                                            ? '0 0 40px rgba(234, 179, 8, 0.4), inset 0 0 30px rgba(234, 179, 8, 0.1)'
                                            : '0 0 40px rgba(239, 68, 68, 0.4), inset 0 0 30px rgba(239, 68, 68, 0.1)'
                                }}>

                                {/* Animated scan line */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                                        style={{ animation: 'scanLineMove 3s linear infinite' }}></div>
                                </div>

                                <div className="absolute inset-0 bg-slate-900/85 rounded-2xl"></div>

                                {/* Icon with enhanced glow */}
                                <div className="relative mb-3">
                                    <Database className="w-14 h-14 text-cyan-300 relative z-10 group-hover:scale-110 transition-transform duration-300"
                                        style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.8))' }} />
                                    <div className="absolute inset-0 bg-cyan-500/40 blur-2xl rounded-full animate-pulse"></div>
                                </div>

                                <span className="font-display font-extrabold text-xl text-slate-100 relative z-10 tracking-wide">Master</span>
                                <span className="text-xs text-slate-400 relative z-10 font-tech font-semibold mt-1">{master?.id}</span>

                                {/* Corner accent */}
                                <div className="absolute bottom-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                            </div>

                            {master?.health !== 'down' && (
                                <div className="absolute -top-2 -right-2 z-20">
                                    <div className="relative flex items-center justify-center">
                                        <div className={`w-5 h-5 rounded-full relative z-10 ${master?.health === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                            style={{
                                                boxShadow: master?.health === 'warning'
                                                    ? '0 0 15px rgba(234, 179, 8, 0.8)'
                                                    : '0 0 15px rgba(16, 185, 129, 0.8)'
                                            }}></div>
                                        <div className={`absolute inset-0 w-5 h-5 rounded-full animate-ping ${master?.health === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'} opacity-75`}></div>
                                        <div className={`absolute inset-0 w-5 h-5 rounded-full blur-md ${master?.health === 'warning' ? 'bg-yellow-500/50' : 'bg-emerald-500/50'} animate-pulse`}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Stats Card */}
                        <div className="mt-10 text-center animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="relative text-xs text-slate-400 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md px-5 py-4 rounded-xl border border-slate-700/60 shadow-2xl w-48 overflow-hidden group/card hover:border-cyan-500/40 transition-all duration-300">
                                {/* Card background effects */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700/60">
                                        <span className="text-slate-400 font-tech font-bold uppercase tracking-wider text-[10px]">Resources</span>
                                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-slate-400 font-tech">CPU</span>
                                        <span className="text-cyan-400 font-mono font-bold">{master?.system?.cpu?.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between mb-3 pb-3 border-b border-slate-700/60">
                                        <span className="text-slate-400 font-tech">Mem</span>
                                        <span className="text-blue-400 font-mono font-bold">{master?.system?.memoryPercent?.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 font-tech">Conns</span>
                                        <span className="text-emerald-400 font-mono font-bold text-base">{master?.metrics?.connections}</span>
                                    </div>
                                </div>

                                {/* Bottom glow */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Arrows with Animation */}
                    <div className="flex flex-col gap-24">
                        {replicas.map((_, i) => (
                            <div key={i} className="flex items-center group/arrow animate-fade-in" style={{ animationDelay: `${300 + i * 100}ms` }}>
                                <div className="relative">
                                    {/* Base arrow line */}
                                    <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-cyan-500/50 rounded-full"></div>

                                    {/* Animated flowing effect */}
                                    <div className="absolute inset-0 h-1.5 w-24 rounded-full overflow-hidden">
                                        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent will-change-transform"
                                            style={{ animation: 'flowRight 2s linear infinite' }}></div>
                                    </div>

                                    {/* Hover pulse */}
                                    <div className="absolute inset-0 h-1.5 w-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-0 group-hover/arrow:opacity-60 transition-opacity duration-300 animate-pulse"></div>

                                    {/* Glow effect */}
                                    <div className="absolute inset-0 h-1.5 w-24 bg-cyan-400 rounded-full blur-md opacity-30 group-hover/arrow:opacity-50 transition-opacity duration-300"></div>
                                </div>
                                <ArrowRight className="w-8 h-8 -ml-2 text-cyan-400 drop-shadow-lg group-hover/arrow:text-cyan-300 group-hover/arrow:scale-110 transition-all duration-300"
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))' }} />
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Replicas Column */}
                    <div className="flex flex-col gap-24">
                        {replicas.map((replica, index) => (
                            <div key={replica.id} className="relative group/replica animate-slide-in-right"
                                style={{ animationDelay: `${400 + index * 100}ms` }}>
                                <div className="relative w-32 h-32 transition-all duration-500 group-hover/replica:scale-110 group-hover/replica:-rotate-2">
                                    <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center border-4 ${replica.health === 'healthy'
                                        ? 'border-blue-400/60 bg-gradient-to-br from-blue-400/20 to-blue-500/10 shadow-2xl'
                                        : 'border-red-500/60 bg-gradient-to-br from-red-500/20 to-red-600/10 shadow-2xl'
                                        } z-10 backdrop-blur-xl overflow-hidden`}
                                        style={{
                                            boxShadow: replica.health === 'healthy'
                                                ? '0 0 30px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1)'
                                                : '0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 20px rgba(239, 68, 68, 0.1)'
                                        }}>

                                        {/* Scan line */}
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
                                                style={{ animation: 'scanLineMove 4s linear infinite', animationDelay: `${index * 0.5}s` }}></div>
                                        </div>

                                        <div className="absolute inset-0 bg-slate-900/85 rounded-2xl"></div>

                                        <div className="relative mb-2">
                                            <Database className="w-10 h-10 text-blue-300 relative z-10 group-hover/replica:scale-110 transition-transform duration-300"
                                                style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' }} />
                                            <div className="absolute inset-0 bg-blue-500/40 blur-xl rounded-full animate-pulse"></div>
                                        </div>

                                        <span className="font-display font-bold text-slate-100 relative z-10 text-base">Replica</span>
                                        <span className="text-[10px] text-slate-400 px-1 truncate w-full text-center relative z-10 font-mono mt-1" title={replica.id}>{replica.id}</span>
                                    </div>

                                    {replica.health === 'healthy' && (
                                        <div className="absolute -top-1.5 -right-1.5 z-20">
                                            <div className="relative flex items-center justify-center">
                                                <div className="w-4 h-4 bg-blue-400 rounded-full relative z-10"
                                                    style={{ boxShadow: '0 0 12px rgba(59, 130, 246, 0.8)' }}></div>
                                                <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                                                <div className="absolute inset-0 w-4 h-4 bg-blue-400/50 blur-md rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Info Card */}
                                <div className="absolute left-full top-1/2 -translate-y-1/2 w-64 text-left pl-6 ml-2">
                                    <div className="relative text-xs text-slate-300 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md p-5 rounded-xl border border-slate-700/60 shadow-2xl group/info overflow-hidden hover:border-blue-500/40 transition-all duration-300">
                                        {/* Background effects */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/info:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover/info:opacity-100 transition-opacity duration-500"></div>

                                        <div className="relative z-10">
                                            <div className='flex justify-between items-center mb-4 pb-3 border-b border-slate-700/60'>
                                                <div className="flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-blue-400" style={{ filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))' }} />
                                                    <span className='font-tech font-bold text-slate-200 tracking-wide'>Sync State</span>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-tech font-extrabold border ${replica.replication?.state === 'streaming'
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' // Green for Streaming
                                                    : !replica.replication?.state
                                                    ? 'bg-red-500/20 text-red-500 border-red-500/40' // Red for Missing/Disconnected
                                                    : 'bg-slate-700/50 text-slate-400 border-slate-600/50' // Gray for other states like waiting
                                                    }`} style={{
                                                        boxShadow: replica.replication?.state === 'streaming'
                                                            ? '0 0 10px rgba(16, 185, 129, 0.3)'
                                                            : !replica.replication?.state
                                                                ? '0 0 10px rgba(239, 68, 68, 0.3)'
                                                                : 'none'
                                                    }}>
                                                    {replica.replication?.state || 'DISCONNECTED'}
                                                </span>
                                            </div>

                                            <div className="space-y-2.5 mb-4">
                                                <div className="flex justify-between text-[11px]">
                                                    <span className="text-slate-400 font-tech">Replication Lag</span>
                                                    <span className="font-mono text-cyan-400 font-bold">{replica.replication?.lag_seconds || 0}s</span>
                                                </div>
                                                <div className="flex justify-between text-[11px]">
                                                    <span className="text-slate-400 font-tech">LSN Position</span>
                                                    <span className="font-mono text-slate-400 w-24 truncate text-right text-[9px]" title={replica.replication?.last_lsn}>
                                                        {replica.replication?.last_lsn}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-slate-700/60 flex flex-col gap-2.5">
                                                <div className="flex justify-between text-[11px]">
                                                    <span className='text-slate-500 font-tech font-semibold'>CPU Usage</span>
                                                    <span className="font-mono text-blue-400 font-bold">{replica.system?.cpu?.toFixed(1)}%</span>
                                                </div>
                                                <div className="flex justify-between text-[11px]">
                                                    <span className='text-slate-500 font-tech font-semibold'>Memory</span>
                                                    <span className="font-mono text-blue-400 font-bold">{replica.system?.memoryPercent?.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom glow */}
                                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
                    <MetricCard
                        title="Master Load"
                        value={master?.metrics?.active_queries || 0}
                        subValue="Active Queries"
                        icon={Activity}
                        status="healthy"
                    />
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
                    <MetricCard
                        title="Connected Replicas"
                        value={master?.replication?.connected_replicas?.length || 0}
                        status={master?.replication?.connected_replicas?.length === replicas.length ? 'healthy' : 'warning'}
                        icon={Database}
                        subValue={`${master?.replication?.connected_replicas?.length || 0}/${replicas.length} Online`}
                    />
                </div>
                <div className="animate-scale-in" style={{ animationDelay: '300ms' }}>
                    <MetricCard
                        title="Replication Lag"
                        value={`${Math.max(...replicas.map(r => r.replication?.lag_seconds || 0), 0)}s`}
                        subValue="Max Replica Delay"
                        status="healthy"
                        icon={Clock}
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes gridPulse {
                    0%, 100% { opacity: 0.03; }
                    50% { opacity: 0.06; }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(20px, -20px); }
                    66% { transform: translate(-15px, 15px); }
                }
                @keyframes scanLineMove {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(2000%); }
                }
                @keyframes flowRight {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                @keyframes pulseRing {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.3; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default PostgresCluster;