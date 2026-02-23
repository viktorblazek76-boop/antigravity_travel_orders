'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProject(data: {
    name: string
    customer: string
    pmId: string
    prdId: string
    teamBudget?: string | number
    projectValue?: string | number
    phases: string[]
    phaseDates?: (string | null)[]
}) {
    const { name, customer, pmId, prdId, phases, phaseDates, teamBudget, projectValue } = data

    const project = await prisma.project.create({
        data: {
            name,
            customer,
            pmId,
            prdId,
            teamBudget: teamBudget ? parseFloat(teamBudget.toString()) : 0,
            projectValue: projectValue ? parseFloat(projectValue.toString()) : 0,
            phases: {
                create: phases.map((phaseName, index) => ({
                    name: phaseName,
                    order: index,
                    dueDate: phaseDates && phaseDates[index] ? new Date(phaseDates[index]!) : null
                }))
            }
        }
    })

    revalidatePath('/')
    revalidatePath('/projects')
    return project
}

export async function addPhase(projectId: string, name: string, dueDate?: string) {
    const lastPhase = await prisma.phase.findFirst({
        where: { projectId },
        orderBy: { order: 'desc' }
    })

    const newOrder = lastPhase ? lastPhase.order + 1 : 0

    await prisma.phase.create({
        data: {
            projectId,
            name,
            order: newOrder,
            dueDate: dueDate ? new Date(dueDate) : null
        }
    })

    revalidatePath('/')
    revalidatePath('/projects')
}

export async function updateProjectBudget(projectId: string, teamBudget: number) {
    await prisma.project.update({
        where: { id: projectId },
        data: {
            teamBudget,
            budgetStatus: 'APPROVED',
            proposedBudget: 0
        }
    })
    revalidatePath('/')
    revalidatePath('/projects')
}

export async function proposeProjectBudget(projectId: string, proposedBudget: number) {
    await prisma.project.update({
        where: { id: projectId },
        data: {
            proposedBudget,
            budgetStatus: 'PROPOSED'
        }
    })
    revalidatePath('/')
    revalidatePath('/projects')
}

export async function approveProjectBudget(projectId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId }
    })
    if (!project || !project.proposedBudget) return

    await prisma.project.update({
        where: { id: projectId },
        data: {
            teamBudget: project.proposedBudget,
            proposedBudget: 0,
            budgetStatus: 'APPROVED'
        }
    })
    revalidatePath('/')
    revalidatePath('/projects')
}

export async function addTeamDrawdown(data: {
    projectId: string
    phaseId: string
    amount: number
    note: string
}) {
    const { projectId, phaseId, amount, note } = data

    // Check budget total
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { rewards: { where: { isTeamReward: true } } }
    })

    if (!project) throw new Error('Project not found')

    const currentDrawdown = project.rewards.reduce((sum, r) => sum + r.amount, 0)
    if (currentDrawdown + amount > project.teamBudget) {
        throw new Error('Překročen týmový rozpočet!')
    }

    await prisma.reward.create({
        data: {
            projectId,
            phaseId,
            amount,
            note,
            isTeamReward: true,
            status: 'PROPOSED'
        }
    })

    revalidatePath('/')
    revalidatePath('/projects')
}

export async function addProjectMember(projectId: string, userId: string, roleInProject: string) {
    // To add a member, we create a dummy reward or just ensure they are visible.
    // In our schema, members are linked via rewards to specific phases.
    // We'll add them with a 0 amount to the first phase of the project to make them appear.

    const firstPhase = await prisma.phase.findFirst({
        where: { projectId },
        orderBy: { order: 'asc' }
    })

    if (!firstPhase) throw new Error('Project has no phases')

    await prisma.reward.upsert({
        where: {
            userId_phaseId: { userId, phaseId: firstPhase.id }
        },
        update: {
            roleInProject
        },
        create: {
            projectId,
            userId,
            phaseId: firstPhase.id,
            amount: 0,
            roleInProject,
            status: 'PROPOSED'
        }
    })

    revalidatePath('/')
    revalidatePath('/projects')
}
