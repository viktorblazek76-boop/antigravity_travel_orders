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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Čeká na schválení"
                    value={`${stats.totalPending.toLocaleString('cs-CZ')} Kč`}
                    icon={<Clock size={20} className="text-amber-600" />}
                    trend="PROPOSED"
                />
                <StatCard
                    label="Schváleno k výplatě"
                    value={`${stats.totalApproved.toLocaleString('cs-CZ')} Kč`}
                    icon={<CheckCircle2 size={20} className="text-emerald-600" />}
                    trend="APPROVED"
                />
                <StatCard
                    label="Aktivní Projekty"
                    value={stats.projectCount.toString()}
                    icon={<Briefcase size={20} className="text-primary" />}
                />
                <StatCard
                    label="Akce k vyřízení"
                    value={stats.pendingActionsCount.toString()}
                    icon={<AlertCircle size={20} className="text-rose-600" />}
                    highlight={stats.pendingActionsCount > 0}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Actions / Tasks */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-sm font-bold text-foreground">Úkoly k vyřízení</h3>
                        <Link href={`/projects?role=${currentRole}`} className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1">
                            Přejít na projekty <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {stats.recentActions.length > 0 ? (
                            stats.recentActions.map((action, i) => (
                                <div key={i} className="bg-white border border-border rounded-sm p-3 flex justify-between items-center hover:bg-accent/40 transition-all group shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-sm flex items-center justify-center border ${action.status === 'PROPOSED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-primary/5 text-primary border-primary/10'
                                            }`}>
                                            {action.isTeamReward ? <Shield size={16} className="text-primary" /> : action.status === 'PROPOSED' ? <Clock size={16} /> : <DollarSign size={16} />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-foreground">{action.user?.name || (action.isTeamReward ? 'Týmový Budget' : 'Neznámý')}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{action.phase?.project?.name} • {action.phase?.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-primary">{action.amount.toLocaleString('cs-CZ')} Kč</div>
                                        <div className="text-[10px] text-muted-foreground italic font-medium">{action.status === 'PROPOSED' ? 'Čeká na schválení' : 'Ke schválení výplaty'}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-accent/20 border border-dashed border-border rounded-sm p-12 text-center text-muted-foreground/30 italic text-xs">
                                Vše hotovo! Žádné úkoly k vyřízení.
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-white border border-border rounded-sm p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-4">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-foreground mb-2">Role: {currentRole}</h3>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                            V tomto pohledu vidíte pouze operativní data. Pro detailní správu fází a celkový přehled projektů použijte sekci <strong>Projekty</strong> v postranním panelu.
                        </p>
                    </div>
                    <Link
                        href={`/users?role=${currentRole}`}
                        className="mt-6 py-1.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-sm text-center text-[11px] font-semibold shadow-sm transition-all"
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
        <div className={`bg-white border rounded-sm p-4 transition-all shadow-sm group ${highlight ? 'border-rose-400' : 'border-border'}`}>
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-accent/50 rounded-sm">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border ${trend === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {trend === 'APPROVED' ? 'SCHVÁLENO' : 'NÁVRH'}
                    </span>
                )}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">{label}</div>
            <div className={`text-xl font-bold tracking-tight ${highlight ? 'text-rose-600' : 'text-foreground'}`}>{value}</div>
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
