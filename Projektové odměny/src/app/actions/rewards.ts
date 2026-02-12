'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function proposeReward(data: {
    userId: string
    phaseId: string
    amount: number
    roleInProject?: string
}) {
    const { userId, phaseId, amount, roleInProject } = data

    // Get projectId from phase
    const phase = await prisma.phase.findUnique({
        where: { id: phaseId },
        select: { projectId: true }
    })

    if (!phase) throw new Error('Phase not found')

    await prisma.reward.upsert({
        where: {
            userId_phaseId: { userId, phaseId }
        },
        update: {
            amount,
            status: 'PROPOSED',
            roleInProject: roleInProject || undefined
        },
        create: {
            userId,
            phaseId,
            projectId: phase.projectId,
            amount,
            status: 'PROPOSED',
            roleInProject: roleInProject || null
        }
    })

    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/team')
}

export async function approveReward(rewardId: string) {
    await prisma.reward.update({
        where: { id: rewardId },
        data: { status: 'APPROVED' }
    })

    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/team')
}

export async function payoutReward(rewardId: string) {
    await prisma.reward.update({
        where: { id: rewardId },
        data: { status: 'PAID' }
    })

    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/team')
}

export async function deleteReward(rewardId: string) {
    await prisma.reward.delete({
        where: { id: rewardId }
    })

    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/team')
}
