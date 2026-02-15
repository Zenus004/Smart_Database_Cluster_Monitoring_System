import React, { useEffect, useState } from 'react';
import MetricCard from '../components/MetricCard';
import { getClusterStatus, getAlerts } from '../services/api';
import { Database, Server, Activity, AlertTriangle, XCircle, CheckCircle, TrendingUp } from 'lucide-react';

const Overview = () => {
    const [status, setStatus] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getClusterStatus();
                const alertData = await getAlerts();
                setStatus(data);
                setAlerts(alertData);
            } catch (error) {
                console.error("Failed to fetch status", error);
                setStatus({ error: error.message });
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
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
                        Loading System Status
                    </p>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>

                {/* Scanning text effect */}
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest animate-pulse">
                    Establishing Connection...
                </p>
            </div>
        </div>
    );

    if (!status || status.error || !status.postgres || !status.mysql) {
        return (
            <div className="max-w-2xl mx-auto mt-20 animate-error-shake">
                <div className="relative bg-gradient-to-br from-red-500/10 to-red-900/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-2xl overflow-hidden group">
                    {/* Animated background effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl animate-float-slow"></div>

                    {/* Warning pattern overlay */}
                    <div className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(239, 68, 68, 0.1) 20px, rgba(239, 68, 68, 0.1) 40px)`,
                        }}>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="relative p-4 bg-red-500/20 rounded-2xl border border-red-500/30 shadow-lg shadow-red-500/20 animate-icon-bounce">
                                <XCircle className="w-10 h-10 text-red-400" />
                                <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl animate-pulse"></div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-red-300 tracking-tight">Connection Error</h3>
                                <p className="text-red-400/80 mt-1.5 text-sm">Could not fetch cluster status</p>
                            </div>
                        </div>
                        <pre className="mt-6 bg-slate-950/70 p-5 rounded-xl text-sm text-red-300/80 overflow-auto border border-red-500/20 font-mono shadow-inner max-h-64 custom-scrollbar">
                            {status?.error || JSON.stringify(status, null, 2) || 'Unknown Error'}
                        </pre>
                        <div className="mt-6 flex items-start gap-3 p-4 bg-red-950/30 rounded-xl border border-red-500/20">
                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                            <div className="text-sm text-slate-400">
                                <p className="font-medium text-red-300 mb-1">Troubleshooting Steps:</p>
                                <ul className="space-y-1 text-xs text-slate-500">
                                    <li>• Check console for detailed error messages</li>
                                    <li>• Ensure backend service is running</li>
                                    <li>• Verify network connectivity</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes error-shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                        20%, 40%, 60%, 80% { transform: translateX(5px); }
                    }
                    @keyframes icon-bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-5px); }
                    }
                    @keyframes pulse-glow {
                        0%, 100% { opacity: 0.1; transform: scale(1); }
                        50% { opacity: 0.2; transform: scale(1.1); }
                    }
                    @keyframes float-slow {
                        0%, 100% { transform: translate(0, 0); }
                        50% { transform: translate(20px, -20px); }
                    }
                    .animate-error-shake {
                        animation: error-shake 0.6s ease-in-out;
                    }
                    .animate-icon-bounce {
                        animation: icon-bounce 2s ease-in-out infinite;
                    }
                    .animate-pulse-glow {
                        animation: pulse-glow 3s ease-in-out infinite;
                    }
                    .animate-float-slow {
                        animation: float-slow 6s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    const pgMaster = status.postgres.find(n => n.role === 'primary');
    const mysqlMaster = status.mysql.find(n => n.role === 'primary');

    const activeAlertsCount = [...status.postgres, ...status.mysql].filter(n => n.health !== 'healthy').length;
    const totalConnections = [...status.postgres, ...status.mysql].reduce((acc, node) => acc + (node.metrics?.connections || 0), 0);

    // Calculate aggregated system resources
    const allNodes = [...status.postgres, ...status.mysql];
    const totalCpuUsage = allNodes.reduce((acc, node) => acc + (node.system?.cpu || 0), 0);
    const totalMemoryUsage = allNodes.reduce((acc, node) => acc + (node.system?.memory || 0), 0);

    // Get host limits from the first valid node
    const firstNode = allNodes.find(n => n.system?.cpuCores);
    const hostCpuCores = firstNode?.system?.cpuCores || 0;
    const hostCpuLimit = hostCpuCores * 100; // 100% per core
    const hostMemoryLimit = firstNode?.system?.memoryLimit || 0;

    return (
        <div className="space-y-8">
            {/* Enhanced Header with animations */}
            <header className="mb-8 animate-slide-in-down">
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/40 shadow-lg group hover:scale-105 transition-transform duration-300">
                        <TrendingUp className="w-8 h-8 text-cyan-400 relative z-10 group-hover:rotate-12 transition-transform duration-300"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))' }} />
                        <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-2xl animate-pulse"></div>
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-2xl"
                            style={{ animation: 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 tracking-tight"
                            style={{ textShadow: '0 0 30px rgba(6, 182, 212, 0.3)' }}>
                            System Overview
                        </h2>
                        <p className="text-slate-400 mt-1.5 font-tech tracking-wide">
                            Real-time cluster health and performance metrics
                        </p>
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-transparent animate-pulse"></div>
            </header>

            {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div style={{ animationDelay: '100ms' }} className="animate-scale-in">
                    <MetricCard
                        title="PostgreSQL Health"
                        value={status.postgres.every(n => n.health === 'healthy') ? 'Healthy' : 'Degraded'}
                        status={status.postgres.every(n => n.health === 'healthy') ? 'healthy' : 'warning'}
                        icon={Database}
                        subValue={`Master + ${status.postgres.filter(n => n.role === 'replica').length} Replicas`}
                    />
                </div>
                <div style={{ animationDelay: '200ms' }} className="animate-scale-in">
                    <MetricCard
                        title="MySQL Health"
                        value={status.mysql.every(n => n.health === 'healthy') ? 'Healthy' : 'Degraded'}
                        status={status.mysql.every(n => n.health === 'healthy') ? 'healthy' : 'warning'}
                        icon={Server}
                        subValue={`Master + ${status.mysql.filter(n => n.role === 'replica').length} Slaves`}
                    />
                </div>
                <div style={{ animationDelay: '300ms' }} className="animate-scale-in">
                    <MetricCard
                        title="Active Alerts"
                        value={activeAlertsCount}
                        status={activeAlertsCount === 0 ? 'healthy' : 'warning'}
                        icon={AlertTriangle}
                        subValue={activeAlertsCount === 0 ? "System normal" : "Nodes down/degraded"}
                    />
                </div>
                <div style={{ animationDelay: '400ms' }} className="animate-scale-in">
                    <MetricCard
                        title="Total Connections"
                        value={totalConnections}
                        status="healthy"
                        icon={Activity}
                        subValue="Across all nodes"
                    />
                </div>
            </div>

            {/* System Resources Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <h3 className="text-slate-400 font-tech uppercase tracking-widest text-xs font-semibold mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-400" />
                            Cluster CPU Usage
                        </h3>
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{totalCpuUsage.toFixed(2)}%</span>
                            <span className="text-sm text-slate-500 font-mono mb-1.5">/ {hostCpuLimit}% ({hostCpuCores} CPUs)</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min((totalCpuUsage / hostCpuLimit) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                        <h3 className="text-slate-400 font-tech uppercase tracking-widest text-xs font-semibold mb-4 flex items-center gap-2">
                            <Database className="w-4 h-4 text-purple-400" />
                            Cluster Memory Usage
                        </h3>
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-3xl font-bold text-slate-100 font-mono">{(totalMemoryUsage / 1024).toFixed(2)} GB</span>
                            <span className="text-sm text-slate-500 font-mono mb-1.5">/ {(hostMemoryLimit / 1024).toFixed(2)} GB</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min((totalMemoryUsage / hostMemoryLimit) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Alert List Section */}
            {alerts.length > 0 && (
                <div className="relative bg-gradient-to-br from-red-500/8 to-orange-500/8 backdrop-blur-xl border border-red-500/30 rounded-2xl p-7 shadow-2xl overflow-hidden animate-fade-in">
                    {/* Animated background */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '25px 25px',
                        animation: 'gridPulse 4s ease-in-out infinite'
                    }}></div>

                    <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-float"
                        style={{ animationDuration: '8s' }}></div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-display font-bold text-red-400 mb-6 flex items-center gap-3">
                            <div className="relative p-2.5 bg-red-500/20 rounded-xl border border-red-500/40">
                                <Activity className="w-6 h-6 relative z-10"
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))' }} />
                                <div className="absolute inset-0 bg-red-500/30 blur-lg rounded-xl animate-pulse"></div>
                            </div>
                            <span className="tracking-wide">Event History</span>
                        </h3>

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {alerts.slice().reverse().map((alert, index) => (
                                <div
                                    key={alert.id}
                                    className={`group relative flex items-start gap-4 p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] overflow-hidden ${alert.severity === 'success'
                                        ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15 hover:border-emerald-500/50'
                                        : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/15 hover:border-red-500/50'
                                        }`}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'slideInRight 0.4s ease-out forwards'
                                    }}
                                >
                                    {/* Hover glow effect */}
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${alert.severity === 'success'
                                        ? 'bg-gradient-to-r from-emerald-500/5 to-transparent'
                                        : 'bg-gradient-to-r from-red-500/5 to-transparent'
                                        }`}></div>

                                    <div className={`relative p-2.5 rounded-lg border ${alert.severity === 'success'
                                        ? 'bg-emerald-500/20 border-emerald-500/40'
                                        : 'bg-red-500/20 border-red-500/40'
                                        }`}>
                                        {alert.severity === 'success' ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-400 relative z-10"
                                                style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' }} />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-400 relative z-10"
                                                style={{ filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))' }} />
                                        )}
                                        <div className={`absolute inset-0 rounded-lg blur-md animate-pulse ${alert.severity === 'success' ? 'bg-emerald-500/30' : 'bg-red-500/30'
                                            }`}></div>
                                    </div>

                                    <div className="flex-1 min-w-0 relative z-10">
                                        <div className={`font-tech font-semibold text-base mb-1.5 ${alert.severity === 'success' ? 'text-emerald-200' : 'text-red-200'
                                            }`}>
                                            {alert.message}
                                        </div>
                                        <div className={`text-xs flex items-center gap-2.5 font-mono ${alert.severity === 'success' ? 'text-emerald-400/70' : 'text-red-400/70'
                                            }`}>
                                            <span className="font-semibold">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                                            <span className="uppercase font-bold tracking-wider">{alert.type}</span>
                                        </div>
                                    </div>

                                    {/* Side accent bar */}
                                    <div className={`absolute right-0 top-0 bottom-0 w-1 ${alert.severity === 'success'
                                        ? 'bg-gradient-to-b from-emerald-500 to-transparent'
                                        : 'bg-gradient-to-b from-red-500 to-transparent'
                                        } opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Node Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PostgreSQL Nodes */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-7 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 overflow-hidden group animate-slide-in-left">
                    {/* Animated grid background */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}></div>

                    <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/15 transition-all duration-500 animate-float"
                        style={{ animationDuration: '10s' }}></div>

                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-display font-bold text-slate-100 mb-6 flex items-center gap-3 tracking-wide">
                            <div className="relative p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-500/40">
                                <Database className="w-6 h-6 text-cyan-400 relative z-10"
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))' }} />
                                <div className="absolute inset-0 bg-cyan-500/30 blur-lg rounded-xl animate-pulse"></div>
                            </div>
                            PostgreSQL Nodes
                        </h3>

                        <div className="space-y-3">
                            {status.postgres.map((node, index) => (
                                <div
                                    key={node.id}
                                    className="group/node relative flex items-center justify-between p-5 bg-slate-800/60 hover:bg-slate-800/90 rounded-xl border border-slate-700/50 hover:border-cyan-500/40 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animation: 'slideInRight 0.5s ease-out forwards'
                                    }}
                                >
                                    {/* Hover gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent opacity-0 group-hover/node:opacity-100 transition-opacity duration-300"></div>

                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="relative flex items-center justify-center">
                                            <div className={`w-3.5 h-3.5 rounded-full relative z-10 ${node.health === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
                                                }`} style={{
                                                    boxShadow: node.health === 'healthy'
                                                        ? '0 0 10px rgba(16, 185, 129, 0.8)'
                                                        : '0 0 10px rgba(239, 68, 68, 0.8)'
                                                }}></div>
                                            <div className={`absolute inset-0 w-3.5 h-3.5 rounded-full animate-ping ${node.health === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
                                                } opacity-75`}></div>
                                            <div className={`absolute inset-0 w-3.5 h-3.5 rounded-full blur-sm ${node.health === 'healthy' ? 'bg-emerald-500/40' : 'bg-red-500/40'
                                                } animate-pulse`}></div>
                                        </div>
                                        <div>
                                            <div className="font-tech font-bold text-base text-slate-200 group-hover/node:text-cyan-300 transition-colors duration-300">
                                                {node.id}
                                            </div>
                                            <div className="text-xs text-slate-500 uppercase font-tech font-semibold tracking-widest mt-0.5">
                                                {node.role}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right relative z-10 space-y-1">
                                        <div className="text-xs text-slate-400 font-mono flex items-center justify-end gap-2">
                                            <span className="text-slate-500 font-semibold">CPU:</span>
                                            <span className="text-cyan-400 font-bold">{node.system?.cpu?.toFixed(1)}%</span>
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono flex items-center justify-end gap-2">
                                            <span className="text-slate-500 font-semibold">Mem:</span>
                                            <span className="text-blue-400 font-bold">{node.system?.memoryPercent?.toFixed(1)}%</span>
                                        </div>
                                    </div>

                                    {/* Side accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 scale-y-0 group-hover/node:scale-y-100 transition-transform duration-300 origin-center"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MySQL Nodes */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-7 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden group animate-slide-in-right">
                    {/* Animated grid background */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}></div>

                    <div className="absolute top-0 right-0 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/15 transition-all duration-500 animate-float"
                        style={{ animationDuration: '10s', animationDelay: '2s' }}></div>

                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-display font-bold text-slate-100 mb-6 flex items-center gap-3 tracking-wide">
                            <div className="relative p-2.5 bg-orange-500/20 rounded-xl border border-orange-500/40">
                                <Server className="w-6 h-6 text-orange-400 relative z-10"
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(251, 146, 60, 0.6))' }} />
                                <div className="absolute inset-0 bg-orange-500/30 blur-lg rounded-xl animate-pulse"></div>
                            </div>
                            MySQL Nodes
                        </h3>

                        <div className="space-y-3">
                            {status.mysql.map((node, index) => (
                                <div
                                    key={node.id}
                                    className="group/node relative flex items-center justify-between p-5 bg-slate-800/60 hover:bg-slate-800/90 rounded-xl border border-slate-700/50 hover:border-orange-500/40 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animation: 'slideInRight 0.5s ease-out forwards'
                                    }}
                                >
                                    {/* Hover gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-transparent opacity-0 group-hover/node:opacity-100 transition-opacity duration-300"></div>

                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="relative flex items-center justify-center">
                                            <div className={`w-3.5 h-3.5 rounded-full relative z-10 ${node.health === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
                                                }`} style={{
                                                    boxShadow: node.health === 'healthy'
                                                        ? '0 0 10px rgba(16, 185, 129, 0.8)'
                                                        : '0 0 10px rgba(239, 68, 68, 0.8)'
                                                }}></div>
                                            <div className={`absolute inset-0 w-3.5 h-3.5 rounded-full animate-ping ${node.health === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'
                                                } opacity-75`}></div>
                                            <div className={`absolute inset-0 w-3.5 h-3.5 rounded-full blur-sm ${node.health === 'healthy' ? 'bg-emerald-500/40' : 'bg-red-500/40'
                                                } animate-pulse`}></div>
                                        </div>
                                        <div>
                                            <div className="font-tech font-bold text-base text-slate-200 group-hover/node:text-orange-300 transition-colors duration-300">
                                                {node.id}
                                            </div>
                                            <div className="text-xs text-slate-500 uppercase font-tech font-semibold tracking-widest mt-0.5">
                                                {node.role}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right relative z-10 space-y-1">
                                        <div className="text-xs text-slate-400 font-mono flex items-center justify-end gap-2">
                                            <span className="text-slate-500 font-semibold">CPU:</span>
                                            <span className="text-orange-400 font-bold">{node.system?.cpu?.toFixed(1)}%</span>
                                        </div>
                                        <div className="text-xs text-slate-400 font-mono flex items-center justify-end gap-2">
                                            <span className="text-slate-500 font-semibold">Mem:</span>
                                            <span className="text-amber-400 font-bold">{node.system?.memoryPercent?.toFixed(1)}%</span>
                                        </div>
                                    </div>

                                    {/* Side accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500/0 via-orange-500/50 to-orange-500/0 scale-y-0 group-hover/node:scale-y-100 transition-transform duration-300 origin-center"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scanLineMove {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(2000%); }
                }
                @keyframes gridPulse {
                    0%, 100% { opacity: 0.03; }
                    50% { opacity: 0.06; }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(15px, -15px); }
                    66% { transform: translate(-15px, 15px); }
                }
                @keyframes pulseRing {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.3; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
                @keyframes slideInRight {
                    0% { 
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    100% { 
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #06b6d4, #3b82f6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #0891b2, #2563eb);
                }
            `}</style>
        </div>
    );
};

export default Overview;