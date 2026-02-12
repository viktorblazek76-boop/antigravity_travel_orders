
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debug() {
    const users = await prisma.user.findMany();
    console.log('Total users:', users.length);
    const manager = users.find(u => u.id === 'cmlglql170000pzp4rlvs6o29');
    console.log('Manager found:', JSON.stringify(manager, null, 2));

    // Also find Poloch
    const poloch = users.find(u => u.name.includes('Poloch'));
    console.log('Poloch found:', JSON.stringify(poloch, null, 2));

    const projects = await prisma.project.findMany({
        where: { name: { contains: 'BC' } }
    });
    console.log('Projects found:', JSON.stringify(projects, null, 2));
}

debug();
