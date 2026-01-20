import { BarChart3, Download, ExternalLink, Filter, Layers } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reporting</h1>
                    <p className="text-slate-500">Analytika a reporty (Power BI Integration REQ-15)</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4" />
                        <span>Exportovat</span>
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        <ExternalLink className="w-4 h-4" />
                        <span>Otevřít v Power BI</span>
                    </button>
                </div>
            </header>

            {/* MOCK POWER BI DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 text-slate-300">
                    <BarChart3 className="w-24 h-24 mb-4 opacity-20" />
                    <p className="text-xl font-black uppercase tracking-widest opacity-20">Vložený Power BI Report</p>
                    <p className="text-sm opacity-20 mt-2 font-bold">(Placeholder pro DirectQuery z Azure SQL)</p>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                            <Filter className="w-4 h-4 mr-2" /> Rychlé filtry
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:bg-blue-50 transition-colors">
                                <span className="font-bold text-slate-700">Náklady per divize</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:bg-blue-50 transition-colors">
                                <span className="font-bold text-slate-700">Využití vozidel</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:bg-blue-50 transition-colors">
                                <span className="font-bold text-slate-700">Top cestovatelé</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
                        <h3 className="text-sm font-black text-blue-200 uppercase tracking-widest mb-2">Celkové náklady YTD</h3>
                        <p className="text-4xl font-black">1.245.000 Kč</p>
                        <div className="mt-4 flex items-center text-xs font-bold text-blue-100">
                            <div className="bg-white/20 p-1 rounded mr-2">+12%</div>
                            oproti minulému roku
                        </div>
                        <Layers className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
                    </div>
                </div>
            </div>
        </div>
    );
}

const ChevronRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);
