import { Plus, Car, User, Fuel, Calendar, Search } from 'lucide-react';

export default function VehiclesPage() {
    const vehicles = [
        { id: '1', spz: '5T1 1234', brand: 'Skoda', model: 'Octavia III', owner: 'Firma (Flotila)', usage: 'Sdílené', fuel: 'Diesel', status: 'Aktivní' },
        { id: '2', spz: '1AB 5678', brand: 'Volkswagen', model: 'Passat B8', owner: 'Jan Novák', usage: 'Soukromé', fuel: 'Natural 95', status: 'Aktivní' },
        { id: '3', spz: '7H2 2244', brand: 'Tesla', model: 'Model 3', owner: 'Viktor Blabla', usage: 'Soukromé', fuel: 'Elektřina', status: 'Aktivní' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vozidla</h1>
                    <p className="text-slate-500">Evidence vozidlového parku (Číselníky REQ-06)</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-200">
                    <Plus className="w-5 h-5" />
                    <span>Přidat vozidlo</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                    <div key={v.id} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-200 transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                <Car className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${v.usage === 'Sdílené' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                                {v.usage}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900">{v.spz}</h3>
                            <p className="text-slate-500 font-bold">{v.brand} {v.model}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400 font-bold flex items-center"><User className="w-4 h-4 mr-2" /> Vlastník</span>
                                <span className="text-slate-700 font-bold">{v.owner}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400 font-bold flex items-center"><Fuel className="w-4 h-4 mr-2" /> Palivo</span>
                                <span className="text-slate-700 font-bold">{v.fuel}</span>
                            </div>
                        </div>

                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Car className="w-32 h-32 text-slate-900" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
