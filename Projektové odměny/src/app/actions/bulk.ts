'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function proposePhase(phaseId: string) {
    // Update all rewards in this phase to PROPOSED
    await prisma.reward.updateMany({
        where: { phaseId, status: { not: 'PAID' } },
        data: { status: 'PROPOSED' }
    })

    // Update phase status
    await prisma.phase.update({
        where: { id: phaseId },
        data: { status: 'PROPOSED' }
    })

    revalidatePath('/')
    revalidatePath('/projects')
}

export async function approvePhase(phaseId: string) {
    // Update all proposed rewards in this phase to APPROVED
    await prisma.reward.updateMany({
        where: { phaseId, status: 'PROPOSED' },
        data: { status: 'APPROVED' }
    })

    // Update phase status
    await prisma.phase.update({
        where: { id: phaseId },
        data: { status: 'APPROVED' }
    })

    revalidatePath('/')
    revalidatePath('/projects')
}

export async function payoutPhase(phaseId: string) {
    // Update all approved rewards in this phase to PAID
    await prisma.reward.updateMany({
        where: { phaseId, status: 'APPROVED' },
        data: { status: 'PAID' }
    })

    // Mark phase as paid
    await prisma.phase.update({
        where: { id: phaseId },
        data: { status: 'PAID', isPaid: true, paidAt: new Date() }
    })

    revalidatePath('/')
    revalidatePath('/projects')
}
