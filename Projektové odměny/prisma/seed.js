const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Zahajuji čistou inicializaci systému...');

    // Vytvoření jediného hlavního uživatele (ID)
    const dusanID = await prisma.user.upsert({
        where: { email: 'dusan.taraba@konicaminolta.cz' },
        update: {},
        create: {
            name: 'Dušan Taraba',
            email: 'dusan.taraba@konicaminolta.cz',
            role: 'ID',
        },
    });

    console.log(`Inicializace dokončena. Hlavní administrátor: ${dusanID.name} (ID)`);
    console.log('Databáze je nyní připravena pro ostrý provoz.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
