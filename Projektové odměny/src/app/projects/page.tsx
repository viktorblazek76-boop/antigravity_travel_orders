import React from 'react'
import { prisma } from '@/lib/prisma'
import { ProjectGrid } from '@/components/ProjectGrid'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ role?: string, userId?: string }> }) {
    const session = await auth()

    if (!session) {
        redirect("/api/auth/signin")
    }

    const { role, userId } = await searchParams

    const allUsers = await prisma.user.findMany()

    // Find simulated user based on ID or Role
    const simulatedUser = userId
        ? allUsers.find(u => u.id === userId)
        : allUsers.find(u => u.role === (role || 'ID'))

    const currentRole = simulatedUser?.role || role || 'ID'
    const simulatedUserId = simulatedUser?.id || ''
    const currentUser = simulatedUser

    // Fetch projects based on role
    let projects: any[] = []
    const include = {
        phases: { orderBy: { order: 'asc' as const } },
        rewards: { include: { user: true } }
    }

    if (currentRole === 'ID') {
        projects = await prisma.project.findMany({ include })
    } else if (currentRole === 'PM') {
        projects = await prisma.project.findMany({ where: { pmId: simulatedUserId }, include })
    } else if (currentRole === 'PRD') {
        projects = await prisma.project.findMany({ where: { prdId: simulatedUserId }, include })
    } else if (currentRole === 'MLZ') {
        const teamUserIds = allUsers.filter(u => u.managerId === simulatedUserId).map(u => u.id)
        const dbProjects = await prisma.project.findMany({ include })
        projects = dbProjects.filter(p => p.rewards.some(r => r.userId && teamUserIds.includes(r.userId)))
    }

    return (
        <div className="flex h-screen bg-sidebar text-foreground font-sans overflow-hidden">
            <Sidebar currentUser={currentUser} currentRole={currentRole as string} allUsers={allUsers} />

            <main className="flex-1 flex flex-col overflow-hidden bg-white">
                <Header title="Správa Projektů" currentRole={currentRole as string} userName={currentUser?.name} />

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <ProjectGrid
                        projects={projects}
                        currentRole={currentRole}
                        currentUserId={simulatedUserId}
                        availableUsers={allUsers}
                    />
                </div>
            </main>
        </div>
    )
}
