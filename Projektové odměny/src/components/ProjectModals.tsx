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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div className="bg-white border border-border rounded-sm w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-border bg-accent/30 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary rounded-sm text-white"><Briefcase size={16} /></div>
                        <h3 className="text-sm font-bold text-foreground">Nový Projekt</h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Název Projektu</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all" placeholder="Např. Implementace D365" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Zákazník</label>
                                <input required value={formData.customer} onChange={e => setFormData({ ...formData, customer: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all" placeholder="Zákazník" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Týmový Budget (Pool)</label>
                                <input
                                    type="number"
                                    value={formData.teamBudget}
                                    onChange={(e) => setFormData({ ...formData, teamBudget: e.target.value })}
                                    className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary transition-all font-mono"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Projektový Manažer (PM)</label>
                                <select required value={formData.pmId} onChange={e => setFormData({ ...formData, pmId: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary">
                                    <option value="">Vyberte...</option>
                                    {availableUsers.filter(u => u.role === 'PM' || u.role === 'ID').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Produktový Ředitel (PRD)</label>
                                <select required value={formData.prdId} onChange={e => setFormData({ ...formData, prdId: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary">
                                    <option value="">Vyberte...</option>
                                    {availableUsers.filter(u => u.role === 'PRD' || u.role === 'ID').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Projektové Fáze (až 5)</label>
                            <div className="grid gap-2">
                                {formData.phases.map((p, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-muted-foreground w-3">{i + 1}.</span>
                                        <input
                                            value={p}
                                            onChange={e => handlePhaseChange(i, 'name', e.target.value)}
                                            placeholder={i === 0 ? "Např. Analýza (povinné)" : "Nepovinné..."}
                                            className="flex-1 bg-white border border-border rounded-sm py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30"
                                        />
                                        <input
                                            type="date"
                                            value={formData.phaseDates[i]}
                                            onChange={e => handlePhaseChange(i, 'date', e.target.value)}
                                            className="w-32 bg-white border border-border rounded-sm py-1.5 px-2 text-[10px] outline-none text-muted-foreground"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button disabled={isSubmitting} type="submit" className="w-full py-2 rounded-sm bg-primary hover:bg-primary/90 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div className="bg-white border border-border rounded-sm w-full max-w-sm shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border bg-accent/30 shrink-0">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground"><Calendar className="text-amber-600" size={16} /> Přidat Fázi (Sloupec)</h3>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Název Fáze / Milníku</label>
                            <input required autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Např. Review, Bonus..." className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-amber-500/50" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Termín (Milník)</label>
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-amber-500/50 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-1.5 rounded-sm border border-border text-foreground font-semibold text-xs hover:bg-accent transition-all">Zrušit</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all">Přidat</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div className="bg-white border border-border rounded-sm w-full max-w-sm shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border bg-accent/30 shrink-0">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground"><Users className="text-primary" size={16} /> Přidat Pracovníka</h3>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Zaměstnanec</label>
                            <select required value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30">
                                <option value="">Vyberte...</option>
                                {availableUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Role v Projektu</label>
                            <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="Např. Konzultant" className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30" />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-1.5 rounded-sm border border-border text-foreground font-semibold text-xs hover:bg-accent transition-all">Zrušit</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-1.5 bg-primary hover:bg-primary/90 text-white font-semibold text-xs shadow-sm transition-all">Přidat</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div className="bg-white border border-border rounded-sm w-full max-w-sm shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border bg-accent/30 shrink-0">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground"><Users className="text-primary" size={16} /> Nový Zaměstnanec</h3>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Jméno</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jméno a Příjmení" className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">E-mail</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@konicaminolta.cz" className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Role v Systému</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none">
                                    <option value="ID">ID (Ředitel)</option>
                                    <option value="PM">PM (Project Manager)</option>
                                    <option value="PRD">PRD (Product Director)</option>
                                    <option value="MLZ">MLZ (Manager)</option>
                                    <option value="EMP">EMP (Zaměstnanec)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Nadřízený (MLZ)</label>
                                <select value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none">
                                    <option value="">Žádný</option>
                                    {availableManagers.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-1.5 rounded-sm border border-border text-foreground font-semibold text-xs hover:bg-accent transition-all">Zrušit</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-1.5 bg-primary hover:bg-primary/90 text-white font-semibold text-xs shadow-sm transition-all">{isSubmitting ? 'Vytvářím...' : 'Vytvořit'}</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
            <div className="bg-white border border-border rounded-sm w-full max-w-sm shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-border bg-accent/30 shrink-0">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground"><Users className="text-primary" size={16} /> Upravit Zaměstnance</h3>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Jméno</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Jméno a Příjmení" className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">E-mail</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@konicaminolta.cz" className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Role v Systému</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none">
                                    <option value="ID">ID (Ředitel)</option>
                                    <option value="PM">PM (Project Manager)</option>
                                    <option value="PRD">PRD (Product Director)</option>
                                    <option value="MLZ">MLZ (Manager)</option>
                                    <option value="EMP">EMP (Zaměstnanec)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Nadřízený</label>
                                <select value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })} className="w-full bg-white border border-border rounded-sm py-2 px-3 text-xs outline-none">
                                    <option value="">Žádný</option>
                                    {availableManagers.filter(u => u.id !== user.id).map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-1.5 rounded-sm border border-border text-foreground font-semibold text-xs hover:bg-accent transition-all">Zrušit</button>
                        <button disabled={isSubmitting} type="submit" className="flex-1 py-1.5 bg-primary hover:bg-primary/90 text-white font-semibold text-xs shadow-sm transition-all">{isSubmitting ? 'Ukládám...' : 'Uložit Změny'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
