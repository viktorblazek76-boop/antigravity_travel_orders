import React from 'react'
import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/components/DashboardStats'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

// This would normally come from an auth session
// For the prototype, we'll use a search param to simulate different users
export default async function Page({ searchParams }: { searchParams: Promise<{ role?: string, userId?: string }> }) {
  const { role, userId } = await searchParams

  let allUsers = await prisma.user.findMany()

  // Find simulated user based on ID or Role
  const simulatedUser = userId
    ? allUsers.find(u => u.id === userId)
    : allUsers.find(u => u.role === (role || 'ID'))

  const currentRole = simulatedUser?.role || role || 'ID'
  const simulatedUserId = simulatedUser?.id || ''
  const currentUser = simulatedUser

  // Data visibility logic based on requirements
  let projects: any[] = [];

  if (currentRole === 'ID') {
    // ID sees everything
    projects = await prisma.project.findMany({
      include: {
        phases: { orderBy: { order: 'asc' } },
        rewards: { include: { user: true } }
      }
    })
  } else if (currentRole === 'PM') {
    // PM sees only their projects
    projects = await prisma.project.findMany({
      where: { pmId: simulatedUserId },
      include: {
        phases: { orderBy: { order: 'asc' } },
        rewards: { include: { user: true } }
      }
    })
  } else if (currentRole === 'PRD') {
    // PRD sees only their projects
    projects = await prisma.project.findMany({
      where: { prdId: simulatedUserId },
      include: {
        phases: { orderBy: { order: 'asc' } },
        rewards: { include: { user: true } }
      }
    })
  } else if (currentRole === 'MLZ') {
    // MLZ sees data of their employees but the project structure is still there
    const teamUserIds = allUsers.filter(u => u.managerId === simulatedUserId).map(u => u.id)

    const dbProjects = await prisma.project.findMany({
      include: {
        phases: { orderBy: { order: 'asc' } },
        rewards: {
          where: { userId: { in: teamUserIds } },
          include: { user: true }
        }
      }
    })
    // Only show projects that have rewards for this team
    projects = dbProjects.filter(p => p.rewards.length > 0)
  }


  // Calculate Dashboard Stats
  const allRewards = projects.flatMap(p => p.rewards)
  const stats = {
    totalPending: allRewards.filter(r => r.status === 'PROPOSED').reduce((sum, r) => sum + r.amount, 0),
    totalApproved: allRewards.filter(r => r.status === 'APPROVED').reduce((sum, r) => sum + r.amount, 0),
    projectCount: projects.length,
    pendingActionsCount: allRewards.filter(r =>
      (currentRole === 'ID' && r.status === 'PROPOSED') ||
      ((currentRole === 'ID' || currentRole === 'PRD') && r.status === 'APPROVED')
    ).length,
    recentActions: await prisma.reward.findMany({
      where: {
        status: { in: ['PROPOSED', 'APPROVED'] },
        projectId: { in: projects.map(p => p.id) }
      },
      include: {
        user: true,
        phase: { include: { project: true } }
      },
      orderBy: { id: 'desc' },
      take: 5
    })
  }

  return (
    <div className="flex h-screen bg-sidebar text-foreground font-sans overflow-hidden">
      <Sidebar currentUser={currentUser} currentRole={currentRole as string} allUsers={allUsers} />

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <Header title="Operační Centrum" currentRole={currentRole as string} userName={currentUser?.name} />

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <DashboardStats stats={stats} currentRole={currentRole} />

          <div className="pt-10 border-t border-border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-foreground">Aktivní Projekty</h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Poslední přehled</span>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.slice(0, 3).map(project => (
                  <div key={project.id} className="bg-white border border-border rounded-sm p-5 hover:bg-accent/40 transition-all cursor-pointer shadow-sm group">
                    <h4 className="font-bold text-primary mb-1 text-sm group-hover:underline">{project.name}</h4>
                    <p className="text-[11px] text-muted-foreground mb-4">{project.customer}</p>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                      <span className="text-muted-foreground/60">Fáze</span>
                      <span className="text-foreground">{project.phases.length}</span>
                    </div>
                    <div className="mt-4 h-1 w-full bg-accent rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 border border-dashed border-border rounded-sm flex items-center justify-center text-muted-foreground/40 text-xs italic">
                Žádné aktivní projekty.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
