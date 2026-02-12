'use client'

import React from 'react'
import { CheckCircle2, Clock, DollarSign, Briefcase, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function DashboardStats({
    stats,
    currentRole
}: {
    stats: {
        totalPending: number
        totalApproved: number
        projectCount: number
        pendingActionsCount: number
        recentActions: any[]
    },
    currentRole: string
}) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Čeká na schválení"
                    value={`${stats.totalPending.toLocaleString('cs-CZ')} Kč`}
                    icon={<Clock className="text-amber-500" />}
                    trend="PROPOSED"
                />
                <StatCard
                    label="Schváleno k výplatě"
                    value={`${stats.totalApproved.toLocaleString('cs-CZ')} Kč`}
                    icon={<CheckCircle2 className="text-emerald-500" />}
                    trend="APPROVED"
                />
                <StatCard
                    label="Aktivní Projekty"
                    value={stats.projectCount.toString()}
                    icon={<Briefcase className="text-blue-500" />}
                />
                <StatCard
                    label="Akce k vyřízení"
                    value={stats.pendingActionsCount.toString()}
                    icon={<AlertCircle className="text-rose-500" />}
                    highlight={stats.pendingActionsCount > 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Actions / Tasks */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Úkoly k vyřízení</h3>
                        <Link href={`/projects?role=${currentRole}`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Přejít na projekty <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {stats.recentActions.length > 0 ? (
                            stats.recentActions.map((action, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center hover:bg-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.status === 'PROPOSED' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {action.isTeamReward ? <Shield size={18} className="text-blue-400" /> : action.status === 'PROPOSED' ? <Clock size={18} /> : <DollarSign size={18} />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{action.user?.name || (action.isTeamReward ? 'Týmový Budget' : 'Neznámý')}</div>
                                            <div className="text-[10px] text-white/40 uppercase tracking-widest">{action.phase?.project?.name} • {action.phase?.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-mono font-bold text-blue-400">{action.amount.toLocaleString('cs-CZ')} Kč</div>
                                        <div className="text-[10px] text-white/20 italic">{action.status === 'PROPOSED' ? 'Čeká na schválení' : 'Ke schválení výplaty'}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white/2 border border-dashed border-white/5 rounded-2xl p-12 text-center text-white/20 italic text-sm">
                                Vše hotovo! Žádné úkoly k vyřízení.
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <Shield className="text-blue-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Role: {currentRole}</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            V tomto pohledu vidíte pouze operativní data. Pro detailní správu fází a celkový přehled projektů použijte sekci <strong>Projekty</strong>.
                        </p>
                    </div>
                    <Link
                        href={`/users?role=${currentRole}`}
                        className="mt-6 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-center text-xs font-bold transition-all"
                    >
                        Správa Zaměstnanců
                    </Link>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon, trend, highlight }: { label: string, value: string, icon: React.ReactNode, trend?: string, highlight?: boolean }) {
    return (
        <div className={`bg-white/5 border rounded-2xl p-6 transition-all hover:scale-[1.02] ${highlight ? 'border-rose-500/30' : 'border-white/10'}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-1">{label}</div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
        </div>
    )
}

function Shield({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}
