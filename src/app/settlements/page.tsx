import Link from 'next/link';
import { Calculator, ChevronRight, Clock, MapPin, Search, Filter } from 'lucide-react';

export default function SettlementsListPage() {
    const approvedOrders = [
        { id: 'TCP24001', purpose: 'BC Implementace', user: 'Viktor Blabla', date: '15.01.2024', status: 'Schváleno', destination: 'Praha, CZ' },
        { id: 'ZCP24005', purpose: 'Schůzka s klientským týmem', user: 'Jan Novák', date: '12.01.2024', status: 'Schváleno', destination: 'Brno, CZ' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vyúčtování</h1>
                <p className="text-slate-500">Seznam schválených cest připravených k vyúčtování (REQ-04)</p>
            </header>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <div className="relative w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm" placeholder="Hledat příkaz..." />
                        </div>
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {approvedOrders.length} příkazy k vyřízení
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {approvedOrders.map((order) => (
                        <div key={order.id} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group">
                            <div className="flex items-center space-x-6">
                                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                                    <Calculator className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-black text-slate-900 text-lg tracking-tight">{order.id}</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-tighter">Schváleno</span>
                                    </div>
                                    <h3 className="font-bold text-slate-700">{order.purpose}</h3>
                                    <div className="flex items-center space-x-4 mt-1 text-sm text-slate-400 font-medium">
                                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {order.destination}</span>
                                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {order.date}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/orders/${order.id}/settle`}
                                className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
                            >
                                <span>Vytvořit vyúčtování</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>

                {approvedOrders.length === 0 && (
                    <div className="p-20 text-center text-slate-300 italic">
                        Žádné příkazy nečekají na vyúčtování.
                    </div>
                )}
            </div>
        </div>
    );
}
