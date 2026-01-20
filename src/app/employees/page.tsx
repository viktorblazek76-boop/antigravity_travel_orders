import { Search, Plus, Mail, Shield, UserCheck } from 'lucide-react';

export default function EmployeesPage() {
    const employees = [
        { id: '1', code: 'VBLABLA', name: 'Viktor Blabla', role: 'IT Konzultant', email: 'vblabla@perihelion.cz', status: 'Aktivní' },
        { id: '2', code: 'JNOVAK', name: 'Jan Novák', role: 'Project Manager', email: 'jnovak@perihelion.cz', status: 'Aktivní' },
        { id: '3', code: 'MSVOBODA', name: 'Marek Svoboda', role: 'Účetní', email: 'msvoboda@perihelion.cz', status: 'Aktivní' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Zaměstnanci</h1>
                    <p className="text-slate-500">Správa uživatelů a oprávnění (Číselníky REQ-06)</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 transition-all">
                    <Plus className="w-5 h-5" />
                    <span>Přidat uživatele</span>
                </button>
            </header>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="relative w-96">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Hledat zaměstnance..." />
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                            <th className="px-6 py-4">Kód</th>
                            <th className="px-6 py-4">Jméno</th>
                            <th className="px-6 py-4">Role / Pozice</th>
                            <th className="px-6 py-4">E-mail</th>
                            <th className="px-6 py-4">Stav</th>
                            <th className="px-6 py-4 text-right">Akce</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-900">{emp.code}</td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{emp.name}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{emp.role}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-slate-500">
                                        <Mail className="w-4 h-4 mr-2" />
                                        {emp.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                                        {emp.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Shield className="w-4 h-4" /></button>
                                    <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><UserCheck className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
