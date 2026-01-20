import { getOrderById } from '@/app/actions/orders';
import { getRateSettings } from '@/app/actions/settings';
import SettlementForm from './SettlementForm';
import { notFound } from 'next/navigation';

export default async function SettlementPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await getOrderById(id);
    const rateSettings = await getRateSettings();

    if (!order) {
        return notFound();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <SettlementForm order={order} rateSettings={rateSettings} />
        </div>
    );
}
