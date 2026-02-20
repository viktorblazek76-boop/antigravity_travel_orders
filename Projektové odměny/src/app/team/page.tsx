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
        <div className="flex h-screen bg-sidebar text-foreground font-sans overflow-hidden">
            <Sidebar currentUser={currentUser} currentRole={currentRole as string} allUsers={allUsers} />

            <main className="flex-1 flex flex-col overflow-hidden bg-white">
                <Header title="Můj Tým" currentRole={currentRole as string} userName={currentUser?.name} />

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-accent/30 border-b border-border">
                                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                                    <th className="px-6 py-3">Pracovník</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3 text-right">Dosud nevyplacené odměny</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {team.map(member => {
                                    const totalRewards = member.rewards.reduce((sum, r) => sum + r.amount, 0)
                                    return (
                                        <tr key={member.id} className="hover:bg-accent/40 transition-colors">
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center text-muted-foreground">
                                                        <UserIcon size={14} />
                                                    </div>
                                                    <span className="font-semibold text-xs text-foreground">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-muted-foreground font-medium">{member.role}</td>
                                            <td className="px-6 py-3.5 text-right">
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
