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
            {(currentRole === 'ID') && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-xl shadow-blue-600/20 transition-all"
                    >
                        <Plus size={18} />
                        Nový Projekt
                    </button>
                </div>
            )}

            {projects.map((project) => (
                <div key={project.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/2">
                        <div>
                            <h2 className="text-xl font-bold text-blue-400">{project.name}</h2>
                            <p className="text-sm text-white/40">{project.customer}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            {(currentRole === 'ID' || (currentRole === 'PM' && project.rewards.some(r => r.userId === currentUserId))) && (
                                <button
                                    onClick={() => setActiveProjectForPhase(project.id)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-bold text-amber-500 hover:bg-amber-500/20 transition-all"
                                >
                                    <Plus size={12} />
                                    Přidat Fázi
                                </button>
                            )}
                            <button
                                onClick={() => exportProjectToExcel(project)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all text-white/60 hover:text-white"
                            >
                                <FileDown size={14} />
                                Export do Excelu
                            </button>
                            <span className="text-xs font-medium uppercase tracking-widest text-white/20">Fáze Projektu</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-white/40 text-xs font-medium uppercase border-b border-white/5">
                                    <th className="px-6 py-4 sticky left-0 bg-[#16181d] z-10 w-64 border-r border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span>Pracovník / Role</span>
                                            {(currentRole === 'ID' || currentRole === 'PM') && (
                                                <button
                                                    onClick={() => setActiveProjectForMember(project.id)}
                                                    className="p-1 hover:bg-white/5 rounded text-blue-400 transition-colors"
                                                    title="Přidat pracovníka"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                    {project.phases.map((phase) => (
                                        <th key={phase.id} className="px-6 py-4 min-w-[200px] border-r border-white/5 text-center group">
                                            <div className="flex flex-col items-center gap-1 relative">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col">
                                                        <span>{phase.name}</span>
                                                        {phase.dueDate && (
                                                            <span className="text-[9px] text-white/20 font-normal">
                                                                Termín: {new Date(phase.dueDate).toLocaleDateString('cs-CZ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {/* Bulk Action Buttons */}
                                                    <div className="flex items-center gap-1">
                                                        {currentRole === 'PM' && (phase.status === 'OPEN' || !phase.status) && (
                                                            <button onClick={() => handlePhaseAction(phase.id, 'OPEN')} className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 rounded text-amber-500 text-[9px] font-bold border border-amber-500/30 flex items-center gap-1" title="Navrhnout celý milník k vyplacení">
                                                                <Send size={10} /> NAVRHNOUT
                                                            </button>
                                                        )}
                                                        {currentRole === 'ID' && phase.status === 'PROPOSED' && (
                                                            <button onClick={() => handlePhaseAction(phase.id, 'PROPOSED')} className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded text-emerald-500 text-[9px] font-bold border border-emerald-500/30 flex items-center gap-1" title="Schválit celý milník k vyplacení">
                                                                <Check size={10} /> SCHVÁLIT
                                                            </button>
                                                        )}
                                                        {(currentRole === 'ID' || currentRole === 'PRD') && phase.status === 'APPROVED' && (
                                                            <button onClick={() => handlePhaseAction(phase.id, 'APPROVED')} className="px-2 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-500 text-[9px] font-bold border border-blue-500/30 flex items-center gap-1" title="Odeslat milník do mezd">
                                                                <DollarSign size={10} /> K VÝPLATĚ
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {phase.isPaid ? (
                                                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                                        <CheckCircle2 size={10} /> Vyplaceno
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <RewardStatusBadge status={phase.status || 'OPEN'} />
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-right bg-blue-600/5">Celkem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {Array.from(new Set(project.rewards.filter(r => !r.isTeamReward).map(r => r.userId))).map(userId => {
                                    const userRewards = project.rewards.filter(r => r.userId === userId && !r.isTeamReward)
                                    const userName = userRewards[0]?.user?.name || 'Neznámý'
                                    const projectRole = userRewards[0]?.roleInProject
                                    const total = userRewards.reduce((sum, r) => sum + r.amount, 0)

                                    return (
                                        <tr key={userId} className="hover:bg-white/2 transition-colors">
                                            <td className="px-6 py-4 sticky left-0 bg-[#16181d] z-10 border-r border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                                                        <UserIcon size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{userName}</div>
                                                        <div className="text-[10px] text-white/30 truncate max-w-[150px]">{projectRole}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {project.phases.map(phase => {
                                                const reward = userRewards.find(r => r.phaseId === phase.id)
                                                return (
                                                    <td
                                                        key={phase.id}
                                                        className={`px-6 py-4 border-r border-white/5 text-center cursor-pointer transition-all ${currentRole === 'PM' ? 'hover:bg-blue-600/10' : ''}`}
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
                                                            <div className="group flex flex-col items-center gap-1 relative">
                                                                <span className={`font-mono text-sm ${reward.status === 'PAID' ? 'text-white/40' : 'text-blue-400 font-bold'}`}>
                                                                    {reward.amount.toLocaleString('cs-CZ')} Kč
                                                                </span>
                                                                {/* Only show badge in Phase header now, but keep minimal status here if useful */}
                                                                {/* <RewardStatusBadge status={reward.status} /> */}

                                                                {/* Individual Action Buttons - Removed as per Phase workflow requirements */}
                                                            </div>
                                                        ) : (
                                                            currentRole === 'PM' ? (
                                                                <div className="flex justify-center text-white/5 group-hover:text-blue-400/50">
                                                                    <Plus size={16} />
                                                                </div>
                                                            ) : (
                                                                <span className="text-white/5 italic text-xs">—</span>
                                                            )
                                                        )}
                                                    </td>
                                                )
                                            })}
                                            <td className="px-6 py-4 text-right font-mono font-bold text-blue-400 bg-blue-600/5">
                                                {total.toLocaleString('cs-CZ')} Kč
                                            </td>
                                        </tr>
                                    )
                                })}

                                {/* SUMMARY: INDIVIDUAL TOTALS */}
                                <tr className="bg-white/5 border-t border-white/10">
                                    <td className="px-6 py-3 sticky left-0 bg-[#0f1115] z-10 border-r border-white/5 font-bold text-xs uppercase text-white/40">
                                        Individuální odměny celkem
                                    </td>
                                    {project.phases.map(phase => {
                                        const phaseTotal = project.rewards.filter(r => r.phaseId === phase.id && !r.isTeamReward).reduce((sum, r) => sum + r.amount, 0)
                                        return (
                                            <td key={phase.id} className="px-6 py-3 border-r border-white/5 text-center font-mono text-xs text-white/40">
                                                {phaseTotal > 0 ? `${phaseTotal.toLocaleString('cs-CZ')} Kč` : '—'}
                                            </td>
                                        )
                                    })}
                                    <td className="px-6 py-3 text-right font-mono font-bold text-white/60 bg-white/2">
                                        {project.rewards.filter(r => !r.isTeamReward).reduce((sum, r) => sum + r.amount, 0).toLocaleString('cs-CZ')} Kč
                                    </td>
                                </tr>

                                {/* TEAM REWARD / DRAWDOWN ROW */}
                                <tr className="bg-blue-600/10 border-t-2 border-blue-500/30">
                                    <td className="px-6 py-5 sticky left-0 bg-[#0f1115] z-10 border-r border-white/5 shadow-[5px_0_10px_rgba(0,0,0,0.5)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <div className="font-black text-xs uppercase tracking-tighter text-blue-400">Týmový Budget (Pool)</div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="text-[10px] text-white/60 font-mono">
                                                        Zůstatek: <span className="text-white font-bold">{(project.teamBudget - project.rewards.filter(r => r.isTeamReward).reduce((sum, r) => sum + r.amount, 0)).toLocaleString('cs-CZ')} Kč</span>
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                                    <div className="text-[9px] text-white/30 uppercase flex items-center gap-1">
                                                        z {project.teamBudget.toLocaleString('cs-CZ')} Kč
                                                        {currentRole === 'PM' && (
                                                            <button
                                                                onClick={async () => {
                                                                    const newBudget = prompt('Zadejte navrhovaný týmový budget:', (project.proposedBudget || project.teamBudget).toString())
                                                                    if (newBudget !== null) {
                                                                        const val = parseFloat(newBudget)
                                                                        if (!isNaN(val)) await proposeProjectBudget(project.id, val)
                                                                    }
                                                                }}
                                                                className="p-0.5 hover:bg-white/10 rounded text-amber-500"
                                                                title="Navrhnout změnu budgetu"
                                                            >
                                                                <Edit size={8} />
                                                            </button>
                                                        )}
                                                        {currentRole === 'ID' && (
                                                            <button
                                                                onClick={async () => {
                                                                    const newBudget = prompt('Upravit týmový budget (přímá editace):', project.teamBudget.toString())
                                                                    if (newBudget !== null) {
                                                                        const val = parseFloat(newBudget)
                                                                        if (!isNaN(val)) await updateProjectBudget(project.id, val)
                                                                    }
                                                                }}
                                                                className="p-0.5 hover:bg-white/10 rounded text-blue-400"
                                                                title="Upravit budget přímo"
                                                            >
                                                                <Edit size={8} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {project.budgetStatus === 'PROPOSED' && (
                                                    <div className="mt-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] flex items-center justify-between">
                                                        <span className="text-amber-500 font-bold">NAVRŽENO: {project.proposedBudget.toLocaleString('cs-CZ')} Kč</span>
                                                        {currentRole === 'ID' && (
                                                            <button
                                                                onClick={() => approveProjectBudget(project.id)}
                                                                className="p-0.5 bg-amber-500 text-white rounded hover:bg-amber-400 transition-colors"
                                                                title="Schválit budget"
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
                                            <td key={phase.id} className="px-6 py-4 border-r border-white/5 text-center relative group">
                                                {phaseTotal > 0 ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="font-mono text-sm font-bold text-white">
                                                            {phaseTotal.toLocaleString('cs-CZ')} Kč
                                                        </span>
                                                        <div className="flex gap-1 overflow-x-auto max-w-[150px] scrollbar-none">
                                                            {teamRewards.map(tr => (
                                                                <div key={tr.id} title={tr.note || ''} className="w-2 h-2 rounded-full bg-blue-400/40 cursor-help" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-white/5 italic text-xs">—</span>
                                                )}
                                                {currentRole === 'PM' && !phase.isPaid && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#1a1e26]/80 transition-opacity">
                                                        <button
                                                            onClick={async () => {
                                                                const amountStr = prompt('Částka čerpání:')
                                                                if (!amountStr) return
                                                                const amount = parseFloat(amountStr)
                                                                if (isNaN(amount)) return

                                                                const note = prompt('Poznámka k čerpání:')
                                                                if (!note) return

                                                                try {
                                                                    await addTeamDrawdown({
                                                                        projectId: project.id,
                                                                        phaseId: phase.id,
                                                                        amount,
                                                                        note
                                                                    })
                                                                } catch (err: any) {
                                                                    alert(err.message)
                                                                }
                                                            }}
                                                            className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                    <td className="px-6 py-4 text-right font-mono font-bold text-white">
                                        {project.rewards.filter(r => r.isTeamReward).reduce((sum, r) => sum + r.amount, 0) > 0
                                            ? `${project.rewards.filter(r => r.isTeamReward).reduce((sum, r) => sum + r.amount, 0).toLocaleString('cs-CZ')} Kč`
                                            : '—'}
                                    </td>
                                </tr>

                                <tr className="bg-blue-600/20 border-t-2 border-blue-500/50">
                                    <td className="px-6 py-4 sticky left-0 bg-[#0f1115] z-10 border-r border-white/5 font-black text-sm uppercase text-blue-400">
                                        Celková hodnota projektu
                                    </td>
                                    {project.phases.map(phase => {
                                        const indPhaseTotal = project.rewards.filter(r => r.phaseId === phase.id && !r.isTeamReward).reduce((sum, r) => sum + r.amount, 0)
                                        const teamPhaseTotal = project.rewards.filter(r => r.phaseId === phase.id && r.isTeamReward).reduce((sum, r) => sum + r.amount, 0)
                                        const total = indPhaseTotal + teamPhaseTotal
                                        return (
                                            <td key={phase.id} className="px-6 py-4 border-r border-white/5 text-center font-mono text-sm font-bold text-blue-400">
                                                {total > 0 ? `${total.toLocaleString('cs-CZ')} Kč` : '—'}
                                            </td>
                                        )
                                    })}
                                    <td className="px-6 py-4 text-right font-mono font-black text-blue-400 bg-blue-600/30">
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
