import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding rates...');

    // Clear existing settings
    await prisma.rateSetting.deleteMany();

    // Domestic rates
    await prisma.rateSetting.createMany({
        data: [
            { type: 'domestic', code: 'tier1', baseRate: 140, currency: 'CZK' },
            { type: 'domestic', code: 'tier2', baseRate: 212, currency: 'CZK' },
            { type: 'domestic', code: 'tier3', baseRate: 333, currency: 'CZK' },
        ],
    });

    // Foreign rates
    await prisma.rateSetting.createMany({
        data: [
            { type: 'foreign', code: 'DE', country: 'Německo', baseRate: 45, currency: 'EUR' },
            { type: 'foreign', code: 'AT', country: 'Rakousko', baseRate: 45, currency: 'EUR' },
            { type: 'foreign', code: 'SK', country: 'Slovensko', baseRate: 37, currency: 'EUR' },
            { type: 'foreign', code: 'PL', country: 'Polsko', baseRate: 37, currency: 'EUR' },
        ],
    });

    console.log('Seed completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
