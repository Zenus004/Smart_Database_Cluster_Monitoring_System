import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex relative overflow-hidden">
            {/* Advanced Grid Pattern Overlay */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `
                             linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
                         `,
                        backgroundSize: '50px 50px',
                    }}>
                </div>
            </div>

            {/* Animated Gradient Orbs with Enhanced Movement */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Primary Blue Orb - Top Left */}
                <div className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-20">
                    <div className="w-full h-full bg-gradient-radial from-blue-500/40 via-blue-500/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
                </div>

                {/* Secondary Purple Orb - Top Right */}
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] opacity-20">
                    <div className="w-full h-full bg-gradient-radial from-purple-500/40 via-purple-500/20 to-transparent rounded-full blur-3xl animate-float-medium"></div>
                </div>

                {/* Tertiary Cyan Orb - Bottom Left */}
                <div className="absolute -bottom-40 left-1/4 w-[550px] h-[550px] opacity-20">
                    <div className="w-full h-full bg-gradient-radial from-cyan-500/40 via-cyan-500/20 to-transparent rounded-full blur-3xl animate-float-fast"></div>
                </div>

                {/* Accent Amber Orb - Center Right */}
                <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] opacity-15">
                    <div className="w-full h-full bg-gradient-radial from-amber-500/30 via-amber-500/15 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
                </div>
            </div>

            {/* Animated Scan Lines Effect */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
                <div className="absolute inset-0 animate-scan-lines"
                    style={{
                        backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
                        backgroundSize: '100% 4px',
                    }}>
                </div>
            </div>

            {/* Vignette Effect */}
            <div className="fixed inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
                }}>
            </div>

            <Sidebar />

            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative z-10">
                {/* Content Container with Subtle Animation */}
                <div className="animate-fade-in">
                    <Outlet />
                </div>
            </main>

            {/* Add Custom CSS for animations */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

                * {
                    font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                code, pre, .monospace {
                    font-family: 'JetBrains Mono', 'Courier New', monospace;
                }

                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(30px, -30px) scale(1.05); }
                    50% { transform: translate(-20px, 20px) scale(0.95); }
                    75% { transform: translate(20px, 10px) scale(1.02); }
                }

                @keyframes float-medium {
                    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
                    33% { transform: translate(-40px, 30px) scale(1.08) rotate(5deg); }
                    66% { transform: translate(30px, -20px) scale(0.92) rotate(-5deg); }
                }

                @keyframes float-fast {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    20% { transform: translate(25px, 25px) scale(1.1); }
                    40% { transform: translate(-30px, -15px) scale(0.9); }
                    60% { transform: translate(35px, -25px) scale(1.05); }
                    80% { transform: translate(-20px, 30px) scale(0.95); }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50% { opacity: 0.25; transform: scale(1.1); }
                }

                @keyframes scan-lines {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-float-slow {
                    animation: float-slow 20s ease-in-out infinite;
                }

                .animate-float-medium {
                    animation: float-medium 18s ease-in-out infinite;
                }

                .animate-float-fast {
                    animation: float-fast 15s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }

                .animate-scan-lines {
                    animation: scan-lines 10s linear infinite;
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(15, 23, 42, 0.5);
                }

                ::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.5);
                }
            `}</style>
        </div>
    );
};

export default Layout;