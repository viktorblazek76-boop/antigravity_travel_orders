'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Save, Briefcase, Calendar, Users, Shield } from 'lucide-react'
import { createProject, addPhase, addProjectMember } from '@/app/actions/projects'

// --- CREATE PROJECT MODAL ---
export function CreateProjectModal({
    isOpen,
    onClose,
    availableUsers
}: {
    isOpen: boolean,
    onClose: () => void,
    availableUsers: any[]
}) {
    const [formData, setFormData] = React.useState({
        name: '',
        customer: '',
        pmId: '',
        prdId: '',
        teamBudget: '0',
        phases: ['', '', '', '', ''],
        phaseDates: ['', '', '', '', '']
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.pmId || !formData.prdId) return alert('Vyberte PM a PRD')

        // Filter out empty phase names
        const validPhases = formData.phases.filter(p => p.trim() !== '')
        if (validPhases.length === 0) return alert('Zadejte alespoň jednu fázi projektu.')

        setIsSubmitting(true)
        try {
            await createProject({
                ...formData,
                phases: validPhases,
                phaseDates: formData.phaseDates.slice(0, validPhases.length)
            })
            onClose()
            setFormData({
                name: '',
                customer: '',
                pmId: '',
                prdId: '',
                teamBudget: '0',
                phases: ['', '', '', '', ''],
                phaseDates: ['', '', '', '', '']
            })
        } catch (error) {
            console.error(error)
            alert('Chyba při vytváření projektu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePhaseChange = (index: number, field: 'name' | 'date', value: string) => {
        if (field === 'name') {
            const newPhases = [...formData.phases]
            newPhases[index] = value
            setFormData({ ...formData, phases: newPhases })
        } else {
            const newDates = [...formData.phaseDates]
            newDates[index] = value
            setFormData({ ...formData, phaseDates: newDates })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white"><Briefcase size={20} /></div>
                        <h3 className="text-xl font-bold text-white">Nový Projekt</h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Název Projektu</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Např. Implementace D365" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Zákazník</label>
                                <input required value={formData.customer} onChange={e => setFormData({ ...formData, customer: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Zákazník" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Týmový Budget (Pool)</label>
                                <input
                                    type="number"
                                    value={formData.teamBudget}
                                    onChange={(e) => setFormData({ ...formData, teamBudget: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Projektový Manažer (PM)</label>
                                <select required value={formData.pmId} onChange={e => setFormData({ ...formData, pmId: e.target.value })} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50">
                                    <option value="">Vyberte...</option>
                                    {availableUsers.filter(u => u.role === 'PM' || u.role === 'ID').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Produktový Ředitel (PRD)</label>
                                <select required value={formData.prdId} onChange={e => setFormData({ ...formData, prdId: e.target.value })} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50">
                                    <option value="">Vyberte...</option>
                                    {availableUsers.filter(u => u.role === 'PRD' || u.role === 'ID').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Projektové Fáze (až 5)</label>
                            <div className="grid gap-2">
                                {formData.phases.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold text-white/10 w-4">{i + 1}.</span>
                                        <input
                                            value={p}
                                            onChange={e => handlePhaseChange(i, 'name', e.target.value)}
                                            placeholder={i === 0 ? "Např. Analýza (povinné)" : "Nepovinné..."}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                        <input
                                            type="date"
                                            value={formData.phaseDates[i]}
                                            onChange={e => handlePhaseChange(i, 'date', e.target.value)}
                                            className="w-32 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-[10px] outline-none focus:ring-2 focus:ring-blue-500/20 text-white/60"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button disabled={isSubmitting} type="submit" className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                            {isSubmitting ? 'Vytvářím...' : <>Vytvořit Projekt</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// --- ADD PHASE MODAL ---
export function AddPhaseModal({ isOpen, onClose, projectId }: { isOpen: boolean, onClose: () => void, projectId: string }) {
    const [name, setName] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await addPhase(projectId, name, dueDate)
            onClose()
            setName('')
            setDueDate('')
        } catch (error) {
            alert('Chyba při přidávání fáze')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-3"><Calendar className="text-amber-500" size={20} /> Přidat Fázi (Sloupec)</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Název Fáze / Milníku</label>
                            <input required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Např. Review, Bonus..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Termín (Milník)</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-amber-500/50 text-white/60" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-white/40 hover:bg-white/5 rounded-xl border border-white/10">Zrušit</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-600/20">Přidat</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// --- ADD MEMBER MODAL ---
export function AddMemberModal({
    isOpen,
    onClose,
    projectId,
    availableUsers
}: {
    isOpen: boolean,
    onClose: () => void,
    projectId: string,
    availableUsers: any[]
}) {
    const [formData, setFormData] = useState({ userId: '', role: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await addProjectMember(projectId, formData.userId, formData.role)
            onClose()
            setFormData({ userId: '', role: '' })
        } catch (error) {
            alert('Chyba přidávání pracovníka')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-3"><Users className="text-blue-500" size={20} /> Přidat Pracovníka</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Zaměstnanec</label>
                        <select required value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none">
                            <option value="">Vyberte...</option>
                            {availableUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Role v Projektu</label>
                        <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="Např. Konzultant" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-white/40 hover:bg-white/5 rounded-xl border border-white/10">Zrušit</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20">Přidat</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// --- CREATE USER MODAL ---
export function CreateUserModal({
    isOpen,
    onClose,
    availableManagers = []
}: {
    isOpen: boolean,
    onClose: () => void,
    availableManagers?: any[]
}) {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'PM', managerId: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const { createUser } = await import('@/app/actions/users')
            await createUser(formData)
            onClose()
            setFormData({ name: '', email: '', role: 'PM', managerId: '' })
        } catch (error: any) {
            alert('Chyba při vytváření uživatele: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-3"><Users className="text-blue-500" size={20} /> Nový Zaměstnanec</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Jméno</label>
                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jméno a Příjmení" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">E-mail</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@konicaminolta.cz" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Role v Systému</label>
                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none">
                                <option value="ID">ID (Ředitel)</option>
                                <option value="PM">PM (Project Manager)</option>
                                <option value="PRD">PRD (Product Director)</option>
                                <option value="MLZ">MLZ (Manager)</option>
                                <option value="EMP">EMP (Zaměstnanec)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Nadřízený (MLZ)</label>
                            <select value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none">
                                <option value="">Žádný</option>
                                {availableManagers.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-white/40 hover:bg-white/5 rounded-xl border border-white/10">Zrušit</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20">{isSubmitting ? 'Vytvářím...' : 'Vytvořit'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// --- EDIT USER MODAL ---
export function EditUserModal({
    isOpen,
    onClose,
    user,
    availableManagers = []
}: {
    isOpen: boolean,
    onClose: () => void,
    user: any,
    availableManagers?: any[]
}) {
    const [formData, setFormData] = useState({ name: '', email: '', role: '', managerId: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'PM',
                managerId: user.managerId || ''
            })
        }
    }, [user])

    if (!isOpen || !user) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const { updateUser } = await import('@/app/actions/users')
            await updateUser(user.id, formData)
            onClose()
        } catch (error: any) {
            alert('Chyba při úpravě uživatele: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center gap-3"><Users className="text-blue-500" size={20} /> Upravit Zaměstnance</h3>
                    <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                        <Plus className="rotate-45" size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Jméno</label>
                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jméno a Příjmení" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">E-mail</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@konicaminolta.cz" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Role v Systému</label>
                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none">
                                <option value="ID">ID (Ředitel)</option>
                                <option value="PM">PM (Project Manager)</option>
                                <option value="PRD">PRD (Product Director)</option>
                                <option value="MLZ">MLZ (Manager)</option>
                                <option value="EMP">EMP (Zaměstnanec)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold ml-1">Nadřízený</label>
                            <select value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })} className="w-full bg-[#1a1c23] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none">
                                <option value="">Žádný</option>
                                {availableManagers.filter(u => u.id !== user.id).map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-white/40 hover:bg-white/5 rounded-xl border border-white/10">Zrušit</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20">{isSubmitting ? 'Ukládám...' : 'Uložit Změny'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
