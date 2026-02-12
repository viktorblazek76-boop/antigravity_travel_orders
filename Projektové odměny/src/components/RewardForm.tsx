'use client'

import React, { useState } from 'react'
import { X, DollarSign, User, Calendar, Save } from 'lucide-react'
import { proposeReward } from '@/app/actions/rewards'

type RewardFormProps = {
    isOpen: boolean
    onClose: () => void
    userId: string
    userName: string
    phaseId: string
    phaseName: string
    initialAmount?: number
    initialRole?: string
}

export function RewardForm({
    isOpen,
    onClose,
    userId,
    userName,
    phaseId,
    phaseName,
    initialAmount = 0,
    initialRole = ''
}: RewardFormProps) {
    const [amount, setAmount] = useState(initialAmount.toString())
    const [role, setRole] = useState(initialRole)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await proposeReward({
                userId,
                phaseId,
                amount: parseFloat(amount) || 0,
                roleInProject: role
            })
            onClose()
        } catch (error) {
            console.error('Failed to save reward:', error)
            alert('Chyba při ukládání odměny.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white">Zadat odměnu</h3>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
                            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Pracovník</p>
                                <p className="text-sm font-semibold">{userName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white/2 rounded-xl border border-white/5">
                            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Fáze</p>
                                <p className="text-sm font-semibold">{phaseName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Částka (Kč)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xl font-bold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Role v projektu</label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Např. Senior Konzultant"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-white/10"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/60 font-bold text-sm hover:bg-white/5 transition-all"
                        >
                            Zrušit
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save size={18} />
                            )}
                            Uložit návrh
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
