
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Project: BC pro špitál (cmlgport8002ipz00oxa6a955)
    // Poloch ID: cmlgn0dip000ipz00s981z6gr

    const polochId = 'cmlgn0dip000ipz00s981z6gr';
    const projectId = 'cmlgport8002ipz00oxa6a955';

    console.log('Aktualizuji projekt...');

    const updated = await prisma.project.update({
        where: { id: projectId },
        data: { prdId: polochId }
    });

    console.log(`Projekt "${updated.name}" má nyní nastaveného PRD: Lubomír Poloch`);
    process.exit(0);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
