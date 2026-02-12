import React from 'react'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { UserClientSection } from '@/components/UserClientSection'
import { UserTable } from '@/components/UserTable'

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ role?: string, userId?: string }> }) {
    const { role, userId } = await searchParams

    const allUsers = await prisma.user.findMany({
        include: { manager: true },
        orderBy: { name: 'asc' }
    })

    // Find simulated user based on ID or Role
    const simulatedUser = userId
        ? allUsers.find(u => u.id === userId)
        : allUsers.find(u => u.role === (role || 'ID'))

    const currentRole = simulatedUser?.role || role || 'ID'
    const simulatedUserId = simulatedUser?.id || ''
    const currentUser = simulatedUser

    return (
        <div className="flex h-screen bg-[#0f1115] text-white font-sans overflow-hidden">
            <Sidebar currentUser={currentUser} currentRole={currentRole as string} allUsers={allUsers} />

            <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#0f1115] to-[#12141a]">
                <Header title="Správa Zaměstnanců" currentRole={currentRole as string} userName={currentUser?.name} />

                <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20">
                            <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2">Celkem Lidí</div>
                            <div className="text-3xl font-bold">{allUsers.length}</div>
                        </div>
                        {['ID', 'PM', 'PRD', 'MLZ', 'EMP'].map(r => (
                            <div key={r} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20">
                                <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2">Role: {r}</div>
                                <div className="text-3xl font-bold">{allUsers.filter(u => u.role === r).length}</div>
                            </div>
                        ))}
                    </div>

                    {currentRole === 'ID' && (
                        <UserClientSection availableUsers={allUsers} />
                    )}

                    <UserTable users={allUsers} />
                </div>
            </main>
        </div>
    )
}
