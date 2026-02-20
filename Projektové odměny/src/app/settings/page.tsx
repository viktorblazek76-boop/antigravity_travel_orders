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
        <div className="flex h-screen bg-sidebar text-foreground font-sans overflow-hidden">
            <Sidebar currentUser={currentUser} currentRole={currentRole as string} allUsers={allUsers} />

            <main className="flex-1 flex flex-col overflow-hidden bg-white">
                <Header title="Nastavení" currentRole={currentRole as string} userName={currentUser?.name} />

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar max-w-4xl">
                    <div className="space-y-6">
                        <section className="bg-white border border-border rounded-sm p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-1.5 bg-primary/10 rounded-sm text-primary">
                                    <Shield size={18} />
                                </div>
                                <h2 className="text-sm font-bold text-foreground">Osobní Nastavení</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Jméno</label>
                                    <input readOnly value={currentUser?.name || ''} className="w-full bg-accent/20 border border-border rounded-sm px-3 py-2 text-xs font-semibold text-foreground outline-none cursor-default" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold ml-0.5">Role v Systému</label>
                                    <input readOnly value={currentUser?.role || ''} className="w-full bg-accent/20 border border-border rounded-sm px-3 py-2 text-xs font-semibold text-primary outline-none cursor-default" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
