'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getOrders() {
    return await prisma.travelOrder.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            days: true
        }
    });
}

export async function createOrder(formData: any) {
    console.log('--- CREATE ORDER START ---');

    try {
        const order = await prisma.travelOrder.create({
            data: {
                destination: formData.destination || (formData.routeSegments?.[0]?.to) || 'Unspecified',
                purpose: formData.purpose || 'Business Trip',
                status: 'Submitted',
                approverName: formData.approverName || 'Nespecifikován',
                startDate: new Date(formData.startDate || new Date()),
                endDate: new Date(formData.endDate || new Date()),
                exchangeRate: 25.30,
                advances: {
                    create: formData.advances?.map((adv: any) => ({
                        amount: Number(adv.amount) || 0,
                        currency: adv.currency || 'CZK'
                    })) || []
                }
            }
        });
        console.log('--- SUCCESS: Order created in DB with ID:', order.id);
    } catch (e: any) {
        console.error('--- CRITICAL ERROR: Prisma create failed ---', e);
        throw e;
    }

    revalidatePath('/')
    revalidatePath('/orders')
    redirect('/')
}

export async function approveOrder(id: string) {
    await prisma.travelOrder.update({
        where: { id },
        data: { status: 'Approved' }
    });
    revalidatePath('/');
    revalidatePath('/orders');
}

export async function getOrderById(id: string) {
    return await prisma.travelOrder.findUnique({
        where: { id },
        include: {
            days: true,
            advances: true,
            expenses: true
        }
    });
}

export async function saveSettlement(id: string, data: any) {
    // Update the order with settlement data
    await prisma.travelOrder.update({
        where: { id },
        data: {
            status: 'Settled',
            vehicleId: data.mileage?.vehicleId,
            initialKm: Number(data.mileage?.initialKm),
            finalKm: Number(data.mileage?.finalKm),
            advanceDeduction: Number(data.advanceDeduction),
            exchangeRate: Number(data.exchangeRate),

            // Re-create days (simplified replacement)
            days: {
                deleteMany: {},
                create: data.days?.map((day: any) => ({
                    date: new Date(day.date),
                    startTime: day.startTime,
                    endTime: day.endTime,
                    startPlace: day.startPlace,
                    endPlace: day.endPlace,
                    country: day.country,
                    breakfast: !!day.breakfast,
                    lunch: !!day.lunch,
                    dinner: !!day.dinner
                }))
            },

            // Re-create expenses
            expenses: {
                deleteMany: {},
                create: data.actualExpenses?.map((exp: any) => ({
                    date: new Date(exp.date),
                    type: exp.type,
                    description: exp.desc,
                    amount: Number(exp.amount),
                    currency: exp.currency
                }))
            }
        }
    });

    revalidatePath(`/orders/${id}/settle`)
    revalidatePath('/')
    return { success: true }
}
