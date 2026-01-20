'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getRateSettings() {
    return await prisma.rateSetting.findMany();
}

export async function updateRateSettings(data: any) {
    // Basic implementation: update existing or create new
    // For domestic rates, we use constant codes tier1, tier2, tier3

    // This is a simplified bulk update
    for (const setting of data) {
        if (setting.id) {
            await prisma.rateSetting.update({
                where: { id: setting.id },
                data: {
                    baseRate: Number(setting.baseRate),
                    currency: setting.currency,
                    country: setting.country,
                }
            });
        } else {
            await prisma.rateSetting.create({
                data: {
                    type: setting.type,
                    code: setting.code,
                    country: setting.country,
                    baseRate: Number(setting.baseRate),
                    currency: setting.currency,
                }
            });
        }
    }

    revalidatePath('/settings/rates')
    return { success: true }
}

export async function deleteRateSetting(id: string) {
    await prisma.rateSetting.delete({
        where: { id }
    });
    revalidatePath('/settings/rates')
}
