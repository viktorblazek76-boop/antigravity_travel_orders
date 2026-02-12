import React from 'react'
import { prisma } from '@/lib/prisma'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react'

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ role?: string, userId?: string }> }) {
    const { role, userId } = await searchParams

    const allUsers = await prisma.user.findMany()

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
                <Header title="Nastavení" currentRole={currentRole as string} userName={currentUser?.name} />

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar max-w-4xl">
                    <div className="space-y-6">
                        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                                    <Shield size={20} />
                                </div>
                                <h2 className="text-lg font-bold">Osobní Nastavení</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Jméno</label>
                                    <input readOnly value={currentUser?.name || ''} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Role v Systému</label>
                                    <input readOnly value={currentUser?.role || ''} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none text-white/40" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
