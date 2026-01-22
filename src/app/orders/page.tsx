import Link from 'next/link';
import { Search, Plus, ExternalLink, Filter, MapPin } from 'lucide-react';
import { getOrders } from '@/app/actions/orders';
import { format } from 'date-fns';
import ApproveButton from '@/components/ApproveButton';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    const { status: filterStatus } = await searchParams;
    let orders = await getOrders();

    if (filterStatus) {
        orders = orders.filter((o: any) => o.status === filterStatus);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {filterStatus === 'Submitted' ? 'Příkazy ke schválení' :
                            filterStatus === 'Approved' ? 'Příkazy k vyúčtování' :
                                filterStatus === 'Settled' ? 'Vyúčtované příkazy' :
                                    'Moje příkazy'}
                    </h1>
                    <p className="text-slate-500">
                        {filterStatus === 'Submitted' ? 'Žádosti čekající na vaše schválení' :
                            'Přehled a správa cestovních příkazů v databázi'}
                    </p>
                </div>
                <Link
                    href="/orders/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-200"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nový příkaz</span>
                </Link>
            </header>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <div className="relative w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm" placeholder="Hledat..." />
                        </div>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center space-x-2">
                            <Filter className="w-4 h-4" />
                            <span>Filtry</span>
                        </button>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">ID / Datum</th>
                            <th className="px-6 py-4">Účel a Cíl</th>
                            <th className="px-6 py-4">Schvalující / Stav</th>
                            <th className="px-6 py-4 text-right">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-bold italic">
                                    Zatím žádné cestovní příkazy. Klikněte na "Nový příkaz".
                                </td>
                            </tr>
                        ) : orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-black text-blue-600 tracking-tight">{order.id.slice(-8).toUpperCase()}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                                        {format(new Date(order.startDate), 'dd.MM.yyyy')}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{order.destination}</div>
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                        <MapPin className="w-3 h-3 mr-1" /> {order.purpose || 'Služební cesta'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-bold text-slate-500 mb-1">{order.approverName || 'Nespecifikován'}</div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${order.status === 'Settled' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'Submitted' ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-100 text-slate-500'
                                        }`}>
                                        {order.status === 'Approved' ? 'Schváleno' :
                                            order.status === 'Settled' ? 'Vyúčtováno' :
                                                order.status === 'Submitted' ? 'Ke schválení' : order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        {order.status === 'Submitted' && (
                                            <ApproveButton id={order.id} />
                                        )}
                                        {order.status === 'Approved' && (
                                            <Link href={`/orders/${order.id}/settle`} className="p-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap">
                                                Vyúčtovat
                                            </Link>
                                        )}
                                        <Link href={`/orders/${order.id}/settle`} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-200">
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
