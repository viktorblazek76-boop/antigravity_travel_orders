
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const projects = await prisma.project.findMany({
        include: { pm: true, prd: true }
    });
    console.log('--- Proyectos ---');
    projects.forEach(p => {
        console.log(`${p.name} (ID: ${p.id})`);
        console.log(`  PM: ${p.pm?.name} (${p.pmId})`);
        console.log(`  PRD: ${p.prd?.name} (${p.prdId})`);
    });
    process.exit(0);
}

main();
