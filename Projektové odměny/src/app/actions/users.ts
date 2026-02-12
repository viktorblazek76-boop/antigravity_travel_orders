'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createUser(data: {
    name: string
    email: string
    role: string
    managerId?: string
}) {
    const { name, email, role, managerId } = data
    const user = await prisma.user.create({
        data: {
            name,
            email,
            role,
            managerId: managerId === '' ? null : managerId
        }
    })

    revalidatePath('/team')
    revalidatePath('/users')
    return user
}


export async function updateUser(id: string, data: {
    name: string
    email: string
    role: string
    managerId?: string
}) {
    const { name, email, role, managerId } = data
    const user = await prisma.user.update({
        where: { id },
        data: {
            name,
            email,
            role,
            managerId: managerId === '' ? null : managerId
        }
    })

    revalidatePath('/team')
    revalidatePath('/users')
    return user
}
