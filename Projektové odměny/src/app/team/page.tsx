import React from 'react'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { Users, User as UserIcon } from 'lucide-react'
import { TeamRewardsBreakdown } from '@/components/TeamRewardsBreakdown'

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ role?: string, userId?: string }> }) {
    const { role, userId } = await searchParams

    const allUsers = await prisma.user.findMany({
        include: {
            rewards: {
                where: {
                    status: { in: ['PROPOSED', 'APPROVED'] }
                },
                include: {
                    project: { select: { name: true } },
                    phase: { select: { name: true } }
                }
            }
        }
    })

    // Find simulated user based on ID or Role
    const simulatedUser = userId
        ? allUsers.find(u => u.id === userId)
        : allUsers.find(u => u.role === (role || 'ID'))

    const currentRole = simulatedUser?.role || role || 'ID'
    const simulatedUserId = simulatedUser?.id || ''
    const currentUser = simulatedUser

    // Recursive function to get all subordinate IDs
    function getSubordinateIds(users: any[], managerId: string): string[] {
        const directSubordinates = users.filter(u => u.managerId === managerId)
        let ids = directSubordinates.map(u => u.id)
        for (const sub of directSubordinates) {
            ids = [...ids, ...getSubordinateIds(users, sub.id)]
        }
        return ids
    }

    const subordinateIds = getSubordinateIds(allUsers, simulatedUserId)
    const team = currentRole === 'ID'
        ? allUsers.filter(u => u.id !== simulatedUserId)
        : allUsers.filter(u => subordinateIds.includes(u.id))

    return (
        <div className="flex h-screen bg-[#0f1115] text-white font-sans overflow-hidden">
            <Sidebar currentUser={currentUser} currentRole={currentRole as string} allUsers={allUsers} />

            <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#0f1115] to-[#12141a]">
                <Header title="Můj Tým" currentRole={currentRole as string} userName={currentUser?.name} />

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/2 border-b border-white/10">
                                <tr className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                                    <th className="px-6 py-4">Pracovník</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Dosud nevyplacené odměny</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {team.map(member => {
                                    const totalRewards = member.rewards.reduce((sum, r) => sum + r.amount, 0)
                                    return (
                                        <tr key={member.id} className="hover:bg-white/2 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                                        <UserIcon size={14} />
                                                    </div>
                                                    <span className="font-medium">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white/40">{member.role}</td>
                                            <td className="px-6 py-4 text-right">
                                                <TeamRewardsBreakdown
                                                    memberName={member.name}
                                                    rewards={member.rewards as any}
                                                    totalAmount={totalRewards}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
