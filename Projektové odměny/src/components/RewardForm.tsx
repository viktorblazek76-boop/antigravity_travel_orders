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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div className="bg-white border border-border rounded-sm w-full max-w-sm shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border bg-accent/30">
                    <h3 className="text-sm font-bold text-foreground">Zadat odměnu</h3>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 bg-accent/20 rounded-sm border border-border">
                            <div className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center text-primary">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Pracovník</p>
                                <p className="text-xs font-semibold text-foreground">{userName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2 bg-accent/20 rounded-sm border border-border">
                            <div className="w-8 h-8 bg-amber-50 rounded-sm flex items-center justify-center text-amber-600 border border-amber-100">
                                <Calendar size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Fáze</p>
                                <p className="text-xs font-semibold text-foreground">{phaseName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Částka (Kč)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                autoFocus
                                className="w-full bg-white border border-border rounded-sm py-2 pl-9 pr-3 text-lg font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Role v projektu</label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Např. Senior Konzultant"
                            className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/40"
                        />
                    </div>

                    <div className="pt-2 flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-1.5 rounded-sm border border-border text-foreground font-semibold text-xs hover:bg-accent transition-all"
                        >
                            Zrušit
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-1.5 rounded-sm bg-primary hover:bg-primary/90 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save size={16} />
                            )}
                            Uložit návrh
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
