import { Settings as SettingsIcon, Bell, Shield, Database, Globe, Cloud } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const sections = [
        { title: 'Sazby a náhrady', desc: 'Konfigurace stravného a náhrad za vozidla', icon: Database },
        { title: 'Uživatelé a Role', desc: 'Správa přístupů a schvalovacích matic', icon: Shield },
        { title: 'Integrace', desc: 'Nastavení Dynamics 365 a Microsoft Graph', icon: Cloud },
        { title: 'Jazyk a Lokalizace', desc: 'Nastavení výchozího jazyka a měny', icon: Globe },
        { title: 'Notifikace', desc: 'E-mailové a Teams upozornění', icon: Bell },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nastavení</h1>
                <p className="text-slate-500">Konfigurace systému (REQ-18)</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => {
                    const Card = (
                        <div key={section.title} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center space-x-6 hover:border-blue-200 cursor-pointer transition-all group h-full">
                            <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                <section.icon className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{section.title}</h3>
                                <p className="text-sm text-slate-400 font-medium">{section.desc}</p>
                            </div>
                        </div>
                    );

                    if (section.title === 'Sazby a náhrady') {
                        return <Link key={section.title} href="/settings/rates">{Card}</Link>;
                    }

                    return Card;
                })}
            </div>
        </div>
    );
}
