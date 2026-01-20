'use client'

import { useTransition } from 'react';
import { approveOrder } from '@/app/actions/orders';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function ApproveButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => startTransition(() => approveOrder(id))}
            disabled={isPending}
            className="inline-flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-green-600 hover:text-white transition-all disabled:opacity-50"
        >
            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
            <span>Schválit</span>
        </button>
    );
}
