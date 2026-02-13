import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Server, Activity } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/postgres', label: 'PostgreSQL Cluster', icon: Database },
        { path: '/mysql', label: 'MySQL Cluster', icon: Server },
        { path: '/admin', label: 'Admin Controls', icon: Activity },
    ];

    return (
        <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl">
            {/* Animated border glow effect */}
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent pointer-events-none animate-border-glow"></div>

            {/* Ambient background effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none animate-ambient-pulse"></div>

            {/* Logo Header */}
            <div className="relative p-6 border-b border-slate-800/50 bg-gradient-to-br from-slate-800/40 to-transparent overflow-hidden group">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-slide-horizontal"></div>

                <div className="relative z-10">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2 animate-gradient-flow">
                        <div className="relative group-hover:scale-110 transition-transform duration-500">
                            <Activity className="w-6 h-6 text-blue-500 relative z-10 animate-icon-pulse" />
                            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse-glow"></div>
                            <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full animate-pulse-glow-delayed"></div>
                        </div>
                        <span className="tracking-tight">DB Monitor</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium monospace tracking-wide group-hover:text-slate-400 transition-colors duration-300">
                        Real-time Cluster Health
                    </p>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item, index) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden animate-nav-item ${isActive
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:shadow-md'
                            }`
                        }
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active state effects */}
                                {isActive && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 animate-shimmer-flow"></div>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-cyan-400 via-blue-300 to-blue-500 rounded-r-full shadow-lg shadow-blue-400/50 animate-height-pulse"></div>
                                        {/* Particle effect */}
                                        <div className="absolute inset-0 opacity-30">
                                            <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-particle-1"></div>
                                            <div className="absolute bottom-3 right-8 w-1 h-1 bg-cyan-300 rounded-full animate-particle-2"></div>
                                        </div>
                                    </>
                                )}

                                {/* Icon with enhanced animation */}
                                <div className="relative">
                                    <item.icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${isActive
                                        ? 'drop-shadow-[0_0_8px_rgba(147,197,253,0.5)] animate-icon-float'
                                        : 'group-hover:scale-110 group-hover:rotate-6'
                                        }`} />
                                    {isActive && (
                                        <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse-slow"></div>
                                    )}
                                </div>

                                {/* Label with letter-spacing animation */}
                                <span className={`font-medium relative z-10 tracking-wide transition-all duration-300 ${isActive ? 'font-semibold' : 'group-hover:tracking-wider'
                                    }`}>
                                    {item.label}
                                </span>

                                {/* Hover effect for inactive items */}
                                {!isActive && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        {/* Hover glow on left edge */}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full group-hover:h-8 transition-all duration-300 shadow-lg shadow-blue-400/50"></div>
                                    </>
                                )}

                                {/* Ripple effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400/30 rounded-full group-hover:animate-ripple"></div>
                                </div>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Status */}
            <div className="p-4 border-t border-slate-800/50 bg-gradient-to-t from-slate-800/20 to-transparent relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.1) 10px, rgba(59, 130, 246, 0.1) 20px)`,
                    }}>
                </div>

                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg hover:shadow-xl hover:border-slate-600/50 transition-all duration-500 group overflow-hidden">
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-tech font-semibold uppercase tracking-widest">
                            System Status
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative z-10"
                                    style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)' }}></div>
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                                <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md animate-pulse"></div>
                            </div>
                            <span className="text-xs text-emerald-400 font-tech font-bold uppercase tracking-wider"
                                style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>
                                Online
                            </span>
                        </div>
                    </div>

                    {/* Data flow animation */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent overflow-hidden">
                        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                            style={{ animation: 'flowRight 2s linear infinite' }}></div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-radial from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                </div>
            </div>

            <style jsx>{`
                @keyframes border-glow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }

                @keyframes ambient-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                @keyframes slide-horizontal {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes gradient-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes icon-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }

                @keyframes pulse-glow-delayed {
                    0%, 100% { opacity: 0.2; transform: scale(1.1); }
                    50% { opacity: 0.4; transform: scale(1.3); }
                }

                @keyframes nav-item {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes shimmer-flow {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                @keyframes height-pulse {
                    0%, 100% { height: 2.5rem; }
                    50% { height: 2rem; }
                }

                @keyframes particle-1 {
                    0%, 100% { transform: translate(0, 0); opacity: 0; }
                    50% { transform: translate(-10px, -10px); opacity: 1; }
                }

                @keyframes particle-2 {
                    0%, 100% { transform: translate(0, 0); opacity: 0; }
                    50% { transform: translate(10px, 10px); opacity: 1; }
                }

                @keyframes icon-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.5); }
                }

                @keyframes ripple {
                    0% { width: 0.5rem; height: 0.5rem; opacity: 1; }
                    100% { width: 8rem; height: 8rem; opacity: 0; }
                }

                @keyframes connection-flow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }

                @keyframes flowRight {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }

                .animate-border-glow {
                    animation: border-glow 3s ease-in-out infinite;
                }

                .animate-ambient-pulse {
                    animation: ambient-pulse 8s ease-in-out infinite;
                }

                .animate-slide-horizontal {
                    animation: slide-horizontal 3s ease-in-out infinite;
                }

                .animate-gradient-flow {
                    background-size: 200% 200%;
                    animation: gradient-flow 6s ease infinite;
                }

                .animate-icon-pulse {
                    animation: icon-pulse 2s ease-in-out infinite;
                }

                .animate-pulse-glow {
                    animation: pulse-glow 3s ease-in-out infinite;
                }

                .animate-pulse-glow-delayed {
                    animation: pulse-glow-delayed 3s ease-in-out infinite 1s;
                }

                .animate-nav-item {
                    animation: nav-item 0.5s ease-out;
                }

                .animate-shimmer-flow {
                    background-size: 200% 100%;
                    animation: shimmer-flow 3s linear infinite;
                }

                .animate-height-pulse {
                    animation: height-pulse 2s ease-in-out infinite;
                }

                .animate-particle-1 {
                    animation: particle-1 3s ease-in-out infinite;
                }

                .animate-particle-2 {
                    animation: particle-2 3s ease-in-out infinite 1.5s;
                }

                .animate-icon-float {
                    animation: icon-float 2s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }

                .animate-ripple {
                    animation: ripple 1s ease-out;
                }

                .animate-connection-flow {
                    background-size: 200% 100%;
                    animation: connection-flow 2s linear infinite;
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;