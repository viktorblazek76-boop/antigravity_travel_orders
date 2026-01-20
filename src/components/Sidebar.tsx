import Link from 'next/link';
import { Home, ClipboardList, Settings, PieChart, Users, Car, Plane, Calculator } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/' },
        { icon: ClipboardList, label: 'Moje příkazy', href: '/orders' },
        { icon: Calculator, label: 'Vyúčtování', href: '/settlements' },
        { icon: PieChart, label: 'Reporting', href: '/reports' },
        { icon: Users, label: 'Zaměstnanci', href: '/employees' },
        { icon: Car, label: 'Vozidla', href: '/vehicles' },
        { icon: Settings, label: 'Nastavení', href: '/settings' },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-2xl">
            <div className="p-8 flex items-center space-x-3 border-b border-slate-800">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Plane className="w-6 h-6 text-white" />
                </div>
                <div className="text-xl font-black tracking-tight">
                    Travel<span className="text-blue-500">Hub</span>
                </div>
            </div>
            <nav className="flex-1 py-6 px-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            <Link
                                href={item.href}
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800/50 transition-all group relative overflow-hidden"
                            >
                                <item.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors z-10" />
                                <span className="font-medium text-slate-300 group-hover:text-white transition-colors z-10">{item.label}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-6 border-t border-slate-800/50">
                <div className="bg-slate-800/50 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status systému</p>
                    <div className="flex items-center text-xs text-green-400 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        Všechny systémy online
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
