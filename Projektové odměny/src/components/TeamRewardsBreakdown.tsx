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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1a1c23] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                    <DollarSign size={18} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Rozpis odměn</h3>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{memberName}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                {rewards.map((reward) => (
                                    <div key={reward.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                                                <Briefcase size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{reward.project.name}</div>
                                                <div className="text-[10px] text-white/40 uppercase tracking-widest">{reward.phase.name}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-mono font-bold text-blue-400">{reward.amount.toLocaleString('cs-CZ')} Kč</div>
                                            <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${reward.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                {reward.status === 'APPROVED' ? 'Schváleno' : 'Navrženo'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-white/2 border-t border-white/5 flex justify-between items-center">
                            <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Dosud nevyplaceno celkem</span>
                            <span className="text-xl font-mono font-bold text-blue-400">{totalAmount.toLocaleString('cs-CZ')} Kč</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
