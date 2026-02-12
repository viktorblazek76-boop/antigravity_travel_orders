'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function proposeReward(rewardId: string) {
    await prisma.reward.update({
        where: { id: rewardId },
        data: { status: 'PROPOSED' }
    })
    revalidatePath('/')
}

export async function approveReward(rewardId: string) {
    await prisma.reward.update({
        where: { id: rewardId },
        data: { status: 'APPROVED' }
    })
    revalidatePath('/')
}

export async function payPhase(phaseId: string) {
    await prisma.phase.update({
        where: { id: phaseId },
        data: {
            isPaid: true,
            paidAt: new Date(),
            rewards: {
                updateMany: {
                    where: { status: 'APPROVED' },
                    data: { status: 'PAID' }
                }
            }
        }
    })
    revalidatePath('/')
}
