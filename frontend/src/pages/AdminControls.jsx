import React, { useEffect, useState } from 'react';
import { getClusterStatus, stopContainer, startContainer, restartContainer, provisionReplica, deprovisionReplica } from '../services/api';
import { Activity, Power, RefreshCw, StopCircle, Shield, PlusCircle, MinusCircle, AlertTriangle } from 'lucide-react';

const AdminControls = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const fetchStatus = async () => {
        try {
            const data = await getClusterStatus();
            setStatus(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (action, name) => {
        setLoading(true);
        setMsg(null);
        try {
            if (action === 'stop') await stopContainer(name);
            if (action === 'start') await startContainer(name);
            if (action === 'restart') await restartContainer(name);
            setMsg({ type: 'success', text: `Action ${action} on ${name} successful` });
            await fetchStatus();
        } catch (error) {
            setMsg({ type: 'error', text: `Action failed: ${error.response?.data?.error || error.message}` });
        } finally {
            setLoading(false);
            setTimeout(() => setMsg(null), 5000);
        }
    };

    const handleProvision = async (type) => {
        setLoading(true);
        setMsg(null);
        try {
            const res = await provisionReplica(type);
            setMsg({ type: 'success', text: res.data.message });
            await fetchStatus();
        } catch (error) {
            setMsg({ type: 'error', text: `Provisioning failed: ${error.response?.data?.error || error.message}` });
        } finally {
            setLoading(false);
            // Don't auto-hide msg quickly so user has time to read the docker-compose instruction
        }
    };

    const handleDeprovision = (type) => {
        setConfirmDialog({
            type,
            title: `Remove ${type === 'postgres' ? 'Postgres Replica' : 'MySQL Slave'}`,
            message: `Are you sure you want to completely remove the last ${type} replica? Its data volume will be preserved but the container will be deleted.`
        });
    };

    const executeDeprovision = async () => {
        if (!confirmDialog) return;
        const { type } = confirmDialog;
        setConfirmDialog(null);
        
        setLoading(true);
        setMsg(null);
        try {
            const res = await deprovisionReplica(type);
            setMsg({ type: 'success', text: res.data.message });
            await fetchStatus();
        } catch (error) {
            setMsg({ type: 'error', text: `Deprovisioning failed: ${error.response?.data?.error || error.message}` });
        } finally {
            setLoading(false);
        }
    };

    if (!status) return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center space-y-6 animate-fade-in">
                <div className="relative inline-block">
                    {/* Main spinner */}
                    <div className="w-20 h-20 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin mx-auto"
                        style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}></div>

                    {/* Secondary spinner */}
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full mx-auto opacity-40"
                        style={{ animation: 'spin 1.5s linear infinite reverse' }}></div>

                    {/* Ping effect */}
                    <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/30 rounded-full animate-ping mx-auto"></div>

                    {/* Center glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-slate-300 font-tech font-semibold text-lg tracking-wide">
                        Loading Nodes
                    </p>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const allNodes = [
        ...status.postgres.map(n => ({ ...n, type: 'Postgres' })),
        ...status.mysql.map(n => ({ ...n, type: 'MySQL' }))
    ];

    return (
        <div className="space-y-8">
            {/* Enhanced Header */}
            <header className="animate-slide-in-down">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="relative p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/40 shadow-lg group hover:scale-105 transition-transform duration-300">
                            <Shield className="w-9 h-9 text-purple-400 relative z-10 group-hover:rotate-12 transition-transform duration-300"
                                style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' }} />
                            <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-2xl animate-pulse"></div>
                            <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-2xl"
                                style={{ animation: 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                        </div>
                        <div>
                            <h2 className="text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 tracking-tight"
                                style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}>
                                Admin Controls
                            </h2>
                            <p className="text-slate-400 mt-1.5 font-tech tracking-wide">
                                Manage database node lifecycle and availability
                            </p>
                        </div>
                    </div>
                    
                    {/* Dynamic Provisioning Controls */}
                    <div className="flex flex-col gap-3 items-end">
                        <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50 shadow-sm">
                            <span className="text-sm font-tech text-slate-400 px-3 w-24 tracking-wide font-semibold">Postgres</span>
                            <button
                                onClick={() => handleProvision('postgres')}
                                disabled={loading}
                                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 transition-all shadow hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Add Postgres Replica"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span className="font-tech text-xs font-bold">Add</span>
                            </button>
                            <button
                                onClick={() => handleDeprovision('postgres')}
                                disabled={loading || status?.postgres?.filter(n => n.role === 'replica').length === 0}
                                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow hover:shadow-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remove Postgres Replica"
                            >
                                <MinusCircle className="w-4 h-4" />
                                <span className="font-tech text-xs font-bold">Remove</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50 shadow-sm">
                            <span className="text-sm font-tech text-slate-400 px-3 w-24 tracking-wide font-semibold">MySQL</span>
                            <button
                                onClick={() => handleProvision('mysql')}
                                disabled={loading}
                                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 transition-all shadow hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Add MySQL Slave"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span className="font-tech text-xs font-bold">Add</span>
                            </button>
                            <button
                                onClick={() => handleDeprovision('mysql')}
                                disabled={loading || status?.mysql?.filter(n => n.role === 'replica').length === 0}
                                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-105 transition-all shadow hover:shadow-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Remove MySQL Slave"
                            >
                                <MinusCircle className="w-4 h-4" />
                                <span className="font-tech text-xs font-bold">Remove</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent animate-pulse"></div>
            </header>

            {/* Enhanced Alert Message */}
            {msg && (
                <div className={`relative overflow-hidden p-6 rounded-xl backdrop-blur-xl border transition-all duration-300 animate-slide-in-down shadow-2xl ${msg.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/40 text-red-300'
                    }`}>
                    {/* Animated background */}
                    <div className={`absolute inset-0 opacity-20 ${msg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} style={{ animation: 'shimmer 3s linear infinite' }}></div>

                    {/* Side accent bar */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${msg.type === 'success' ? 'bg-gradient-to-b from-emerald-500 to-green-600' : 'bg-gradient-to-b from-red-500 to-pink-600'
                        }`} style={{
                            boxShadow: msg.type === 'success'
                                ? '0 0 15px rgba(16, 185, 129, 0.6)'
                                : '0 0 15px rgba(239, 68, 68, 0.6)'
                        }}></div>

                    <div className="relative z-10 flex items-center gap-4 ml-4">
                        <div className={`relative p-3 rounded-xl ${msg.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-red-500/20 border border-red-500/40'
                            }`}>
                            {msg.type === 'success' ? (
                                <Activity className="w-6 h-6 relative z-10"
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' }} />
                            ) : (
                                <StopCircle className="w-6 h-6 relative z-10"
                                    style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))' }} />
                            )}
                            <div className={`absolute inset-0 rounded-xl blur-lg animate-pulse ${msg.type === 'success' ? 'bg-emerald-500/30' : 'bg-red-500/30'
                                }`}></div>
                        </div>
                        <span className="font-tech font-bold text-lg tracking-wide">{msg.text}</span>
                    </div>

                    {/* Bottom glow */}
                    <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${msg.type === 'success' ? 'via-emerald-500/50' : 'via-red-500/50'
                        } to-transparent`}></div>
                </div>
            )}

            {/* Enhanced Node Controls Grid */}
            <div className="grid grid-cols-1 gap-6">
                {allNodes.map((node, index) => (
                    <div
                        key={node.id}
                        className="group relative bg-gradient-to-br from-slate-900/90 to-slate-800/60 backdrop-blur-xl p-7 rounded-2xl border border-slate-700/50 hover:border-slate-600/60 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden animate-scale-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Animated grid background */}
                        <div className="absolute inset-0 opacity-[0.02]" style={{
                            backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)`,
                            backgroundSize: '25px 25px'
                        }}></div>

                        {/* Enhanced background gradient effect */}
                        <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-all duration-500 ${node.type === 'Postgres' ? 'bg-cyan-500' : 'bg-orange-500'
                            }`} style={{ animation: 'float 8s ease-in-out infinite' }}></div>

                        {/* Scan line effect */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
                                style={{ animation: 'scanLineMove 3s linear infinite' }}></div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between">
                            {/* Enhanced Node Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`relative p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 ${node.type === 'Postgres'
                                        ? 'bg-cyan-500/10 border-cyan-500/40'
                                        : 'bg-orange-500/10 border-orange-500/40'
                                        }`} style={{
                                            boxShadow: node.type === 'Postgres'
                                                ? '0 0 20px rgba(6, 182, 212, 0.3)'
                                                : '0 0 20px rgba(251, 146, 60, 0.3)'
                                        }}>
                                        <Activity className={`w-6 h-6 relative z-10 ${node.type === 'Postgres' ? 'text-cyan-400' : 'text-orange-400'
                                            }`} style={{
                                                filter: node.type === 'Postgres'
                                                    ? 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))'
                                                    : 'drop-shadow(0 0 6px rgba(251, 146, 60, 0.6))'
                                            }} />
                                        <div className={`absolute inset-0 rounded-xl blur-md opacity-50 animate-pulse ${node.type === 'Postgres' ? 'bg-cyan-500/30' : 'bg-orange-500/30'
                                            }`}></div>
                                    </div>
                                    <div>
                                        <h3 className="font-display font-extrabold text-2xl text-slate-100 mb-2 tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                                            {node.id}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1.5 text-xs rounded-full font-tech font-extrabold border uppercase tracking-wider ${node.system?.status === 'running'
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                                : 'bg-red-500/20 text-red-400 border-red-500/40'
                                                }`} style={{
                                                    boxShadow: node.system?.status === 'running'
                                                        ? '0 0 10px rgba(16, 185, 129, 0.3)'
                                                        : '0 0 10px rgba(239, 68, 68, 0.3)'
                                                }}>
                                                {node.system?.status || 'Unknown'}
                                            </span>
                                            <span className="text-xs text-slate-500 uppercase font-tech font-bold tracking-widest">
                                                {node.type} • {node.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Metrics */}
                                <div className="flex gap-4 ml-16">
                                    <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-700/60 overflow-hidden group/metric hover:border-purple-500/30 transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="text-[10px] text-slate-500 uppercase font-tech font-bold mb-1 tracking-wider">Memory</div>
                                            <div className="text-base font-mono font-extrabold text-purple-400">
                                                {node.system?.memoryPercent?.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-700/60 overflow-hidden group/metric hover:border-pink-500/30 transition-all duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-transparent opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative z-10">
                                            <div className="text-[10px] text-slate-500 uppercase font-tech font-bold mb-1 tracking-wider">CPU</div>
                                            <div className="text-base font-mono font-extrabold text-pink-400">
                                                {node.system?.cpu?.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction('start', node.containerName)}
                                    disabled={loading || node.system?.status === 'running'}
                                    className="group/btn relative p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 text-emerald-400 hover:from-emerald-500/20 hover:to-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-emerald-500/30 hover:border-emerald-500/50 hover:scale-110 disabled:hover:scale-100 shadow-lg hover:shadow-emerald-500/30 overflow-hidden"
                                    title="Start Container"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-emerald-400/10 to-green-400/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                    <Power className="w-6 h-6 relative z-10"
                                        style={{ filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))' }} />
                                </button>

                                <button
                                    onClick={() => handleAction('restart', node.containerName)}
                                    disabled={loading}
                                    className="group/btn relative p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-400 hover:from-blue-500/20 hover:to-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 hover:scale-110 disabled:hover:scale-100 shadow-lg hover:shadow-blue-500/30 overflow-hidden"
                                    title="Restart Container"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-400/10 to-cyan-400/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                    <RefreshCw className={`w-6 h-6 relative z-10 ${loading ? 'animate-spin' : ''}`}
                                        style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))' }} />
                                </button>

                                <button
                                    onClick={() => handleAction('stop', node.containerName)}
                                    disabled={loading || node.system?.status !== 'running'}
                                    className="group/btn relative p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 text-red-400 hover:from-red-500/20 hover:to-pink-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 border border-red-500/30 hover:border-red-500/50 hover:scale-110 disabled:hover:scale-100 shadow-lg hover:shadow-red-500/30 overflow-hidden"
                                    title="Stop Container"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 via-red-400/10 to-pink-400/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                    <StopCircle className="w-6 h-6 relative z-10"
                                        style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))' }} />
                                </button>
                            </div>
                        </div>

                        {/* Enhanced bottom shine effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse"></div>

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-20">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-purple-500 to-transparent"></div>
                            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-purple-500 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-20">
                            <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-pink-500 to-transparent"></div>
                            <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-pink-500 to-transparent"></div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    33% { transform: translate(15px, -15px); }
                    66% { transform: translate(-15px, 15px); }
                }
                @keyframes scanLineMove {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(2000%); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes pulseRing {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.3; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
            `}</style>
            
            {/* Confirmation Modal */}
            {confirmDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setConfirmDialog(null)}></div>
                    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 bg-[length:200%_auto] animate-[shimmer_2s_linear_infinite]"></div>
                        
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-500/5 blur-[80px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-pink-500/5 blur-[80px] pointer-events-none"></div>

                        <div className="p-8 relative z-10">
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:bg-red-500/30 transition-colors animate-pulse"></div>
                                    <div className="relative p-5 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full border border-red-500/20 backdrop-blur-sm">
                                        <AlertTriangle className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                                    </div>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 text-center mb-3 tracking-tight">
                                {confirmDialog.title}
                            </h3>
                            
                            <p className="text-slate-300 text-center font-tech mb-8 leading-relaxed text-[15px]">
                                {confirmDialog.message}
                            </p>
                            
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConfirmDialog(null)}
                                    className="flex-1 py-3 px-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-xl font-tech font-bold transition-all duration-300 border border-slate-600/50 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 group"
                                >
                                    <span className="group-hover:text-white transition-colors">Cancel</span>
                                </button>
                                <button
                                    onClick={executeDeprovision}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl font-tech font-extrabold transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                    <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                                        Remove Node
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminControls;