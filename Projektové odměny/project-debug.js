
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const p = await prisma.project.findUnique({
        where: { id: 'cmlgport8002ipz00oxa6a955' },
        include: { rewards: { include: { user: true } } }
    });
    fs.writeFileSync('project-debug.json', JSON.stringify(p, null, 2));
}

main();
