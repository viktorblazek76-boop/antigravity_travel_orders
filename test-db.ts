import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Testing travel order creation...')
    try {
        const order = await prisma.travelOrder.create({
            data: {
                destination: 'Test Destination',
                purpose: 'Test Purpose',
                status: 'Approved',
                startDate: new Date(),
                endDate: new Date(),
                exchangeRate: 25.3,
                advances: {
                    create: [
                        { amount: 500, currency: 'CZK' }
                    ]
                }
            }
        })
        console.log('Order created successfully:', order.id)

        // Cleanup
        await prisma.advance.deleteMany({ where: { orderId: order.id } })
        await prisma.travelOrder.delete({ where: { id: order.id } })
        console.log('Cleanup successful.')
    } catch (e) {
        console.error('Creation failed!')
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
