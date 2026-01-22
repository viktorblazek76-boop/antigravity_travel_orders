import { Plus, Clock, CheckCircle, AlertCircle, MapPin, User, Calculator, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getOrders } from '@/app/actions/orders';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import ApproveButton from '@/components/ApproveButton';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const orders = await getOrders();

  const stats = [
    {
      label: 'Ke schválení',
      value: orders.filter((o: any) => o.status === 'Submitted').length.toString(),
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      href: '/orders?status=Submitted'
    },
    {
      label: 'K vyřízení',
      value: orders.filter((o: any) => o.status === 'Approved').length.toString(),
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/orders?status=Approved'
    },
    {
      label: 'Vyúčtováno',
      value: orders.filter((o: any) => o.status === 'Settled').length.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      href: '/orders?status=Settled'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-lg">Vítejte v systému Cestovních příkazů (DB)</p>
        </div>
        <Link
          href="/orders/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Nový příkaz</span>
        </Link>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`${stat.bg} p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group`}
          >
            <div>
              <p className="text-slate-400 font-black mb-1 uppercase tracking-widest text-[10px]">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg} brightness-95 group-hover:brightness-90 transition-all`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Link>
        ))}
      </div>

      {/* RECENT ACTIVITIES TABLE */}
      <section className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center px-2">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Všechny cestovní příkazy
          </h2>
          <span className="text-xs font-bold text-slate-400">{orders.length} záznamů v databázi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">ID / Datum</th>
                <th className="px-6 py-4">Cíl a Účel</th>
                <th className="px-6 py-4">Stav</th>
                <th className="px-6 py-4 text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-bold italic">
                    Zatím žádné cestovní příkazy. Klikněte na "Nový příkaz".
                  </td>
                </tr>
              ) : orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-black text-blue-600 tracking-tight">{order.id.slice(-8).toUpperCase()}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {format(new Date(order.startDate), 'dd.MM.yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm">{order.destination}</div>
                    <div className="flex items-center text-xs text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 mr-1" /> {order.purpose || 'Služební cesta'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${order.status === 'Settled' ? 'bg-green-100 text-green-700' :
                      order.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'Submitted' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-700'
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
                        <Link
                          href={`/orders/${order.id}/settle`}
                          className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-100"
                        >
                          <Calculator className="w-3 h-3" />
                          <span>Vyúčtovat</span>
                        </Link>
                      )}
                      <Link href={`/orders/${order.id}/settle`} className="p-2 text-slate-300 hover:text-slate-600">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
