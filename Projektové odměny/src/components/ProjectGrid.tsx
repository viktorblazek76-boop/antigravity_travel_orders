'use client'

import React, { useState } from 'react'
import { CheckCircle2, Circle, Clock, DollarSign, User as UserIcon, Plus, Check, Send, Edit } from 'lucide-react'
import { RewardForm } from './RewardForm'
import { approveReward, payoutReward } from '@/app/actions/rewards'
import { exportProjectToExcel } from '@/lib/export'
import { FileDown, Info } from 'lucide-react'
import { CreateProjectModal, AddPhaseModal, AddMemberModal } from './ProjectModals'
import { proposePhase, approvePhase, payoutPhase } from '@/app/actions/bulk'
import { addTeamDrawdown, updateProjectBudget, proposeProjectBudget, approveProjectBudget } from '@/app/actions/projects'

type Phase = {
    id: string
    name: string
    isPaid: boolean
    status: string
    dueDate: Date | string | null
}

type Reward = {
    id: string
    userId: string | null
    user: { name: string } | null
    phaseId: string
    amount: number
    roleInProject: string | null
    status: string
    note: string | null
    isTeamReward: boolean
}

type Project = {
    id: string
    name: string
    customer: string
    teamBudget: number
    proposedBudget: number
    projectValue: number
    budgetStatus: string
    phases: Phase[]
    rewards: Reward[]
}

export type ProjectGridProps = {
    projects: Project[]
    currentRole: string
    currentUserId: string
}

export function ProjectGrid({ projects, currentRole, currentUserId, availableUsers = [] }: ProjectGridProps & { availableUsers?: any[] }) {
    const [selectedReward, setSelectedReward] = useState<{
        userId: string
        userName: string
        phaseId: string
        phaseName: string
        amount?: number
        role?: string
    } | null>(null)

    const [activeProjectForPhase, setActiveProjectForPhase] = useState<string | null>(null)
    const [activeProjectForMember, setActiveProjectForMember] = useState<string | null>(null)
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)

    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        // Removed individual approve - now handled by phase
    }

    const handlePayout = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        // Removed individual payout - now handled by phase
    }

    const handlePhaseAction = async (phaseId: string, currentStatus: string) => {
        if (currentStatus === 'OPEN' || currentStatus === 'PAID') {
            if (confirm('Navrhnout celou fázi k vyplacení?')) await proposePhase(phaseId)
        } else if (currentStatus === 'PROPOSED') {
            if (confirm('Schválit celou fázi k vyplacení?')) await approvePhase(phaseId)
        } else if (currentStatus === 'APPROVED') {
            if (confirm('Odeslat celou fázi do mezd/fakturace?')) await payoutPhase(phaseId)
        }
    }

    return (
        <div className="space-y-12">
            {/* Global Actions */}
            {(currentRole === 'ID' || currentRole === 'PM') && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-sm text-sm font-semibold shadow-sm transition-all"
                    >
                        <Plus size={16} />
                        Nový Projekt
                    </button>
                </div>
            )}

            {projects.map((project) => (
                <div key={project.id} className="bg-white border border-border rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-accent/30">
                        <div>
                            <h2 className="text-sm font-bold text-primary">{project.name}</h2>
                            <div className="flex items-center gap-2">
                                <p className="text-[11px] text-muted-foreground">{project.customer}</p>
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm font-bold border border-primary/20">
                                    {project.projectValue.toLocaleString('cs-CZ')} tis. Kč
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            {(currentRole === 'ID' || (currentRole === 'PM' && project.rewards.some(r => r.userId === currentUserId))) && (
                                <button
                                    onClick={() => setActiveProjectForPhase(project.id)}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-border rounded-sm text-[11px] font-semibold text-foreground hover:bg-accent transition-all"
                                >
                                    <Plus size={12} className="text-primary" />
                                    Přidat Fázi
                                </button>
                            )}
                            <button
                                onClick={() => exportProjectToExcel(project)}
                                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-border rounded-sm text-[11px] font-semibold text-foreground hover:bg-accent transition-all"
                            >
                                <FileDown size={14} className="text-primary" />
                                Export
                            </button>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 ml-2">Fáze Projektu</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-muted-foreground text-[10px] font-bold uppercase border-b border-border bg-accent/20">
                                    <th className="px-5 py-3 sticky left-0 bg-white z-10 w-64 border-r border-border">
                                        <div className="flex items-center justify-between">
                                            <span>Pracovník / Role</span>
                                            {(currentRole === 'ID' || currentRole === 'PM') && (
                                                <button
                                                    onClick={() => setActiveProjectForMember(project.id)}
                                                    className="p-1 hover:bg-accent rounded-sm text-primary transition-colors"
                                                    title="Přidat pracovníka"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                    {project.phases.map((phase) => (
                                        <th key={phase.id} className="px-5 py-3 min-w-[180px] border-r border-border text-center group">
                                            <div className="flex flex-col items-center gap-1 relative">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-foreground">{phase.name}</span>
                                                        {phase.dueDate && (
                                                            <span className="text-[9px] text-muted-foreground font-normal">
                                                                {new Date(phase.dueDate).toLocaleDateString('cs-CZ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Bulk Action Buttons */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {currentRole === 'PM' && (phase.status === 'OPEN' || !phase.status) && (
                                                            <button onClick={() => handlePhaseAction(phase.id, 'OPEN')} className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-sm text-[8px] font-bold border border-amber-200" title="Navrhnout k vyplacení">
                                                                <Send size={10} />
                                                            </button>
                                                        )}
                                                        {currentRole === 'ID' && phase.status === 'PROPOSED' && (
                                                            <button onClick={() => handlePhaseAction(phase.id, 'PROPOSED')} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-sm text-[8px] font-bold border border-emerald-200" title="Schválit">
                                                                <Check size={10} />
                                                            </button>
                                                        )}
                                                        {(currentRole === 'ID' || currentRole === 'PRD') && phase.status === 'APPROVED' && (
                                                            <button onClick={() => handlePhaseAction(phase.id, 'APPROVED')} className="px-1.5 py-0.5 bg-primary/5 text-primary rounded-sm text-[8px] font-bold border border-primary/20" title="K výplatě">
                                                                <DollarSign size={10} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {phase.isPaid ? (
                                                    <span className="flex items-center gap-0.5 text-[9px] text-emerald-600 font-semibold italic">
                                                        <CheckCircle2 size={10} /> Vyplaceno
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <RewardStatusBadge status={phase.status || 'OPEN'} />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-5 py-3 text-right bg-primary/5">Celkem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {Array.from(new Set(project.rewards.filter(r => !r.isTeamReward).map(r => r.userId))).map(userId => {
                                    const userRewards = project.rewards.filter(r => r.userId === userId && !r.isTeamReward)
                                    const userName = userRewards[0]?.user?.name || 'Neznámý'
                                    const projectRole = userRewards[0]?.roleInProject
                                    const total = userRewards.reduce((sum, r) => sum + r.amount, 0)

                                    return (
                                        <tr key={userId} className="hover:bg-accent/40 transition-colors">
                                            <td className="px-5 py-3 sticky left-0 bg-white z-10 border-r border-border">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center text-muted-foreground">
                                                        <UserIcon size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-xs text-foreground">{userName}</div>
                                                        <div className="text-[9px] text-muted-foreground uppercase tracking-tight truncate max-w-[150px]">{projectRole}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {project.phases.map(phase => {
                                                const reward = userRewards.find(r => r.phaseId === phase.id)
                                                return (
                                                    <td
                                                        key={phase.id}
                                                        className={`px-5 py-3 border-r border-border text-center cursor-pointer transition-all ${currentRole === 'PM' ? 'hover:bg-primary/5' : ''}`}
                                                        onClick={() => {
                                                            if (currentRole === 'PM' && (!reward || reward.status !== 'PAID') && userId) {
                                                                setSelectedReward({
                                                                    userId,
                                                                    userName: userName || '',
                                                                    phaseId: phase.id,
                                                                    phaseName: phase.name,
                                                                    amount: reward?.amount,
                                                                    role: projectRole || ''
                                                                })
                                                            }
                                                        }}
                                                    >
                                                        {reward ? (
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className={`text-xs font-semibold ${reward.status === 'PAID' ? 'text-muted-foreground/60' : 'text-primary'}`}>
                                                                    {reward.amount.toLocaleString('cs-CZ')} Kč
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            currentRole === 'PM' ? (
                                                                <div className="flex justify-center text-border hover:text-primary/40">
                                                                    <Plus size={14} />
                                                                </div>
                                                            ) : (
                                                                <span className="text-border italic text-[10px]">—</span>
                                                            )
                                                        )}
                                                    </td>
                                                )
                                            })}
                                            <td className="px-5 py-3 text-right text-xs font-bold text-primary bg-primary/5">
                                                {total.toLocaleString('cs-CZ')} Kč
                                            </td>
                                        </tr>
                                    )
                                })}

                                {/* SUMMARY: INDIVIDUAL TOTALS */}
                                <tr className="bg-accent/10">
                                    <td className="px-5 py-2 sticky left-0 bg-accent/20 z-10 border-r border-border font-bold text-[9px] uppercase text-muted-foreground">
                                        Individuální odměny
                                    </td>
                                    {project.phases.map(phase => {
                                        const phaseTotal = project.rewards.filter(r => r.phaseId === phase.id && !r.isTeamReward).reduce((sum, r) => sum + r.amount, 0)
                                        return (
                                            <td key={phase.id} className="px-5 py-2 border-r border-border text-center text-[10px] font-semibold text-muted-foreground/80">
                                                {phaseTotal > 0 ? `${phaseTotal.toLocaleString('cs-CZ')} Kč` : '—'}
                                            </td>
                                        )
                                    })}
                                    <td className="px-5 py-2 text-right text-[10px] font-bold text-muted-foreground/80">
                                        {project.rewards.filter(r => !r.isTeamReward).reduce((sum, r) => sum + r.amount, 0).toLocaleString('cs-CZ')} Kč
                                    </td>
                                </tr>

                                {/* TEAM REWARD / DRAWDOWN ROW */}
                                <tr className="bg-white border-t border-border">
                                    <td className="px-5 py-3 sticky left-0 bg-white z-10 border-r border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                <Shield size={16} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[10px] uppercase text-primary">Týmový Budget</div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div className="text-[9px] text-muted-foreground">
                                                        Zůstatek: <span className="text-foreground font-bold">{(project.teamBudget - project.rewards.filter(r => r.isTeamReward).reduce((sum, r) => sum + r.amount, 0)).toLocaleString('cs-CZ')} Kč</span>
                                                    </div>
                                                    <div className="text-[8px] text-muted-foreground/50 italic">
                                                        ({project.teamBudget.toLocaleString('cs-CZ')} Kč)
                                                    </div>
                                                    {currentRole === 'PM' && (
                                                        <button
                                                            onClick={async () => {
                                                                const newBudget = prompt('Zadejte navrhovaný týmový budget:', (project.proposedBudget || project.teamBudget).toString())
                                                                if (newBudget !== null) {
                                                                    const val = parseFloat(newBudget)
                                                                    if (!isNaN(val)) await proposeProjectBudget(project.id, val)
                                                                }
                                                            }}
                                                            className="p-0.5 hover:bg-accent rounded-sm text-amber-600"
                                                            title="Navrhnout změnu"
                                                        >
                                                            <Edit size={10} />
                                                        </button>
                                                    )}
                                                </div>
                                                {project.budgetStatus === 'PROPOSED' && (
                                                    <div className="mt-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded-sm text-[8px] flex items-center gap-2">
                                                        <span className="text-amber-700 font-bold">NÁVRH: {project.proposedBudget.toLocaleString('cs-CZ')} Kč</span>
                                                        {currentRole === 'ID' && (
                                                            <button
                                                                onClick={() => approveProjectBudget(project.id)}
                                                                className="p-0.5 bg-amber-400 text-white rounded-sm hover:bg-amber-500 transition-colors"
                                                            >
                                                                <Check size={8} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    {project.phases.map(phase => {
                                        const teamRewards = project.rewards.filter(r => r.phaseId === phase.id && r.isTeamReward)
                                        const phaseTotal = teamRewards.reduce((sum, r) => sum + r.amount, 0)

                                        return (
                                            <td key={phase.id} className="px-5 py-3 border-r border-border text-center relative group">
                                                {phaseTotal > 0 ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs font-semibold text-foreground">
                                                            {phaseTotal.toLocaleString('cs-CZ')} Kč
                                                        </span>
                                                        <div className="flex gap-0.5 mt-1">
                                                            {teamRewards.map(tr => (
                                                                <div key={tr.id} title={tr.note || ''} className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-border italic text-[10px]">—</span>
                                                )}
                                                {currentRole === 'PM' && !phase.isPaid && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/90 transition-opacity">
                                                        <button
                                                            onClick={async () => {
                                                                const amountStr = prompt('Částka čerpání:')
                                                                if (!amountStr) return
                                                                const amount = parseFloat(amountStr)
                                                                if (isNaN(amount)) return
                                                                const note = prompt('Poznámka:')
                                                                if (!note) return
                                                                try { await addTeamDrawdown({ projectId: project.id, phaseId: phase.id, amount, note }) } catch (err: any) { alert(err.message) }
                                                            }}
                                                            className="p-1 bg-primary text-white rounded-sm hover:bg-primary/90"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                    <td className="px-5 py-3 text-right text-xs font-bold text-foreground">
                                        {project.rewards.filter(r => r.isTeamReward).reduce((sum, r) => sum + r.amount, 0) > 0
                                            ? `${project.rewards.filter(r => r.isTeamReward).reduce((sum, r) => sum + r.amount, 0).toLocaleString('cs-CZ')} Kč`
                                            : '—'}
                                    </td>
                                </tr>

                                <tr className="bg-primary/5 border-t border-primary/20">
                                    <td className="px-5 py-3 sticky left-0 bg-primary/10 z-10 border-r border-border font-bold text-xs uppercase text-primary">
                                        Hodnota celkem
                                    </td>
                                    {project.phases.map(phase => {
                                        const indPhaseTotal = project.rewards.filter(r => r.phaseId === phase.id && !r.isTeamReward).reduce((sum, r) => sum + r.amount, 0)
                                        const teamPhaseTotal = project.rewards.filter(r => r.phaseId === phase.id && r.isTeamReward).reduce((sum, r) => sum + r.amount, 0)
                                        const total = indPhaseTotal + teamPhaseTotal
                                        return (
                                            <td key={phase.id} className="px-5 py-3 border-r border-border text-center text-xs font-bold text-primary">
                                                {total > 0 ? `${total.toLocaleString('cs-CZ')} Kč` : '—'}
                                            </td>
                                        )
                                    })}
                                    <td className="px-5 py-3 text-right text-sm font-black text-primary bg-primary/20">
                                        {(project.rewards.filter(r => !r.isTeamReward).reduce((sum, r) => sum + r.amount, 0) + project.teamBudget).toLocaleString('cs-CZ')} Kč
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {selectedReward && (
                <RewardForm
                    isOpen={!!selectedReward}
                    onClose={() => setSelectedReward(null)}
                    userId={selectedReward.userId}
                    userName={selectedReward.userName}
                    phaseId={selectedReward.phaseId}
                    phaseName={selectedReward.phaseName}
                    initialAmount={selectedReward.amount}
                    initialRole={selectedReward.role}
                />
            )}

            <CreateProjectModal
                isOpen={isCreateProjectOpen}
                onClose={() => setIsCreateProjectOpen(false)}
                availableUsers={availableUsers}
            />

            {activeProjectForPhase && (
                <AddPhaseModal
                    isOpen={!!activeProjectForPhase}
                    onClose={() => setActiveProjectForPhase(null)}
                    projectId={activeProjectForPhase}
                />
            )}

            {activeProjectForMember && (
                <AddMemberModal
                    isOpen={!!activeProjectForMember}
                    onClose={() => setActiveProjectForMember(null)}
                    projectId={activeProjectForMember}
                    availableUsers={availableUsers}
                />
            )}
        </div>
    )
}

function RewardStatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'PAID': return <span className="text-[9px] text-emerald-400 font-bold">PAID</span>
        case 'APPROVED': return <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Approved for Payroll</span>
        case 'PROPOSED': return <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Proposed for Payout</span>
        case 'OPEN': return <span className="text-[9px] text-white/10 uppercase tracking-wider italic">Open</span>
        default: return <span className="text-[9px] text-white/5 font-mono uppercase italic">{status}</span>
    }
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
