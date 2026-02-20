'use client'

import React, { useState } from 'react'
import { X, DollarSign, Briefcase, ChevronRight } from 'lucide-react'

interface RewardDetail {
    id: string
    amount: number
    status: string
    project: { name: string }
    phase: { name: string }
}

export function TeamRewardsBreakdown({
    memberName,
    rewards,
    totalAmount
}: {
    memberName: string,
    rewards: RewardDetail[],
    totalAmount: number
}) {
    const [isOpen, setIsOpen] = useState(false)

    if (totalAmount === 0) {
        return <span className="text-white/20">—</span>
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-right font-mono font-bold text-blue-400 hover:text-blue-300 transition-colors group flex items-center gap-2 justify-end ml-auto"
            >
                <span>{totalAmount.toLocaleString('cs-CZ')} Kč</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
                    <div className="bg-white border border-border rounded-sm w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center p-4 border-b border-border bg-accent/30 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary rounded-sm text-white">
                                    <DollarSign size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">Rozpis odměn</h3>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{memberName}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-2 overflow-y-auto custom-scrollbar">
                            <div className="space-y-1">
                                {rewards.map((reward) => (
                                    <div key={reward.id} className="bg-white border-b border-border p-3 flex justify-between items-center hover:bg-accent/30 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center text-muted-foreground">
                                                <Briefcase size={12} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-foreground">{reward.project.name}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-tight">{reward.phase.name}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-primary">{reward.amount.toLocaleString('cs-CZ')} Kč</div>
                                            <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border inline-block uppercase tracking-tighter ${reward.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {reward.status === 'APPROVED' ? 'Schváleno' : 'Navrženo'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-accent/20 border-t border-border flex justify-between items-center">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Dosud nevyplaceno celkem</span>
                            <span className="text-lg font-bold text-primary">{totalAmount.toLocaleString('cs-CZ')} Kč</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
