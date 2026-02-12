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
    <div className="flex h-screen bg-[#0f1115] text-white font-sans overflow-hidden">
      <Sidebar currentUser={currentUser} currentRole={currentRole as string} allUsers={allUsers} />

      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#0f1115] to-[#12141a]">
        <Header title="Operační Centrum" currentRole={currentRole as string} userName={currentUser?.name} />

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <DashboardStats stats={stats} currentRole={currentRole} />

          <div className="pt-10 border-t border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Aktivní Projekty</h3>
              <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Poslední přehled</span>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.slice(0, 3).map(project => (
                  <div key={project.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer">
                    <h4 className="font-bold text-blue-400 mb-1">{project.name}</h4>
                    <p className="text-xs text-white/40 mb-4">{project.customer}</p>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                      <span className="text-white/20">Fáze</span>
                      <span className="text-white/60">{project.phases.length}</span>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-1/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/20 italic">
                Žádné aktivní projekty.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
