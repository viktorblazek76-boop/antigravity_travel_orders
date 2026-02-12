import { prisma } from './prisma'

export async function seed() {
    // 1. Users
    const janID = await prisma.user.upsert({
        where: { email: 'jan.id@konicaminolta.cz' },
        update: {},
        create: {
            name: 'Jan ID (Ředitel)',
            email: 'jan.id@konicaminolta.cz',
            role: 'ID',
        },
    })

    const petrPM = await prisma.user.upsert({
        where: { email: 'petr.pm@konicaminolta.cz' },
        update: {},
        create: {
            name: 'Petr PM (Project Manager)',
            email: 'petr.pm@konicaminolta.cz',
            role: 'PM',
        },
    })

    const adamPRD = await prisma.user.upsert({
        where: { email: 'adam.prd@konicaminolta.cz' },
        update: {},
        create: {
            name: 'Adam PRD (Product Director)',
            email: 'adam.prd@konicaminolta.cz',
            role: 'PRD',
        },
    })

    const janaMLZ = await prisma.user.upsert({
        where: { email: 'jana.mlz@konicaminolta.cz' },
        update: {},
        create: {
            name: 'Jana MLZ (Manager)',
            email: 'jana.mlz@konicaminolta.cz',
            role: 'MLZ',
        },
    })

    const emp1 = await prisma.user.upsert({
        where: { email: 'emp1@konicaminolta.cz' },
        update: {},
        create: {
            name: 'Robert Štikar',
            email: 'emp1@konicaminolta.cz',
            role: 'EMP',
            managerId: janaMLZ.id,
        },
    })

    const emp2 = await prisma.user.upsert({
        where: { email: 'emp2@konicaminolta.cz' },
        update: {},
        create: {
            name: 'Libor Štejdýř',
            email: 'emp2@konicaminolta.cz',
            role: 'EMP',
            managerId: janaMLZ.id,
        },
    })

    // 2. Project
    const project = await prisma.project.create({
        data: {
            name: 'Implementace SAP',
            customer: 'Škoda Auto',
            pmId: petrPM.id,
            prdId: adamPRD.id,
            phases: {
                create: [
                    { name: 'Analýza', order: 1, isPaid: true },
                    { name: 'Implementace', order: 2, isPaid: false },
                    { name: 'Akceptace', order: 3, isPaid: false },
                ],
            },
        },
        include: {
            phases: true,
        },
    })

    // 3. Rewards
    for (const phase of project.phases) {
        await prisma.reward.createMany({
            data: [
                {
                    projectId: project.id,
                    userId: emp1.id,
                    phaseId: phase.id,
                    amount: 5000,
                    roleInProject: 'Vedoucí projektu',
                    status: phase.name === 'Analýza' ? 'PAID' : 'PROPOSED',
                },
                {
                    projectId: project.id,
                    userId: emp2.id,
                    phaseId: phase.id,
                    amount: 8000,
                    roleInProject: 'Architekt řešení',
                    status: phase.name === 'Analýza' ? 'PAID' : 'PROPOSED',
                },
            ],
        })
    }

    console.log('Seeding complete.')
}
