import React from 'react';
import { cn } from '../util/Utils';

const MetricCard = ({ title, value, subValue, icon: Icon, status, className }) => {
    const statusColor = status === 'healthy' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-500';
    const bgStatus = status === 'healthy' ? 'bg-green-500/10' : status === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10';
    const borderStatus = status === 'healthy' ? 'border-green-500/20' : status === 'warning' ? 'border-yellow-500/20' : 'border-red-500/20';
    const glowStatus = status === 'healthy' ? 'shadow-green-500/10' : status === 'warning' ? 'shadow-yellow-500/10' : 'shadow-red-500/10';
    const pulseStatus = status === 'healthy' ? 'from-green-500/30' : status === 'warning' ? 'from-yellow-500/30' : 'from-red-500/30';
    const gradientStatus = status === 'healthy' ? 'from-green-500/5 via-emerald-500/5' : status === 'warning' ? 'from-yellow-500/5 via-amber-500/5' : 'from-red-500/5 via-rose-500/5';

    return (
        <div className={cn(
            "group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:border-slate-600/50 overflow-hidden animate-card-enter",
            glowStatus,
            className
        )}>
            {/* Animated Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
                style={{
                    backgroundImage: `
                         linear-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(148, 163, 184, 0.5) 1px, transparent 1px)
                     `,
                    backgroundSize: '20px 20px',
                }}>
            </div>

            {/* Subtle animated gradient overlay */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700",
                gradientStatus
            )}></div>

            {/* Animated corner accent with pulse */}
            <div className={cn(
                "absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700 rounded-full animate-pulse-slow",
                bgStatus
            )}></div>

            {/* Secondary glow effect */}
            <div className={cn(
                "absolute -bottom-8 -left-8 w-32 h-32 blur-2xl opacity-10 group-hover:opacity-20 transition-all duration-700 rounded-full animate-float-subtle",
                bgStatus
            )}></div>

            {/* Diagonal shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rotate-12 scale-150 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-[1.5s] ease-out"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                    <div className="space-y-1">
                        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider group-hover:text-slate-300 transition-colors duration-300 monospace">
                            {title}
                        </h3>
                        {/* Animated underline */}
                        <div className={cn(
                            "h-0.5 w-0 group-hover:w-12 transition-all duration-500 rounded-full bg-gradient-to-r to-transparent",
                            pulseStatus
                        )}></div>
                    </div>
                    <div className={cn(
                        "relative p-3 rounded-xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                        bgStatus,
                        borderStatus
                    )}>
                        {/* Icon glow effect */}
                        <div className={cn(
                            "absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-xl",
                            bgStatus
                        )}></div>
                        {Icon && <Icon className={cn("w-5 h-5 relative z-10 transition-transform duration-500 group-hover:scale-110", statusColor)} />}

                        {/* Status pulse indicator */}
                        {status === 'healthy' && (
                            <div className="absolute -top-1 -right-1 w-2 h-2">
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-4xl font-bold text-slate-100 tracking-tight transition-all duration-300 group-hover:text-white group-hover:scale-105 origin-left monospace">
                        {value}
                    </div>
                    {subValue && (
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-slate-500 font-medium group-hover:text-slate-400 transition-colors duration-300">
                                {subValue}
                            </div>
                            {/* Trend indicator animation */}
                            <div className="w-1 h-1 bg-slate-600 rounded-full animate-pulse-slow"></div>
                        </div>
                    )}
                </div>

                {/* Metric bar visualization */}
                <div className="mt-4 h-1 bg-slate-800/50 rounded-full overflow-hidden">
                    <div className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r to-transparent animate-shimmer",
                        pulseStatus,
                        "w-0 group-hover:w-[70%]"
                    )}></div>
                </div>
            </div>

            {/* Bottom shine effect with animation */}
            <div className="absolute bottom-0 left-0 right-0 h-px">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-slide-shine"></div>
            </div>

            {/* Corner decorative elements */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-600/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-600/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <style jsx>{`
                @keyframes card-enter {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.2;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.4;
                    }
                }

                @keyframes float-subtle {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    33% {
                        transform: translate(5px, -5px) rotate(5deg);
                    }
                    66% {
                        transform: translate(-5px, 5px) rotate(-5deg);
                    }
                }

                @keyframes slide-shine {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }

                .animate-card-enter {
                    animation: card-enter 0.6s ease-out;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }

                .animate-float-subtle {
                    animation: float-subtle 8s ease-in-out infinite;
                }

                .animate-slide-shine {
                    animation: slide-shine 2s ease-in-out infinite;
                }

                .animate-shimmer {
                    background-size: 200% 100%;
                    animation: shimmer 2s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default MetricCard;