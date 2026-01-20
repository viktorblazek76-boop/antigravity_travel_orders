'use client';

import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import {
    Car, Info, Send, Clock, Plus, Trash2, Paperclip, ChevronRight,
    Calculator, ArrowRight, Loader2
} from 'lucide-react';
import { useMemo, useTransition } from 'react';
import { saveSettlement } from '@/app/actions/orders';

interface SettlementFormProps {
    order: any;
    rateSettings: any[];
}

export default function SettlementForm({ order, rateSettings }: SettlementFormProps) {
    const [isPending, startTransition] = useTransition();

    const domesticRates = {
        tier1: rateSettings.find(s => s.type === 'domestic' && s.code === 'tier1')?.baseRate || 140,
        tier2: rateSettings.find(s => s.type === 'domestic' && s.code === 'tier2')?.baseRate || 212,
        tier3: rateSettings.find(s => s.type === 'domestic' && s.code === 'tier3')?.baseRate || 333,
    };

    const foreignRates = rateSettings
        .filter(s => s.type === 'foreign')
        .map(s => ({
            country: s.country,
            code: s.code,
            currency: s.currency,
            base: s.baseRate
        }));

    const { register, handleSubmit, control, watch } = useForm({
        defaultValues: {
            exchangeRate: order.exchangeRate || 25.30,
            days: order.days?.length > 0 ? order.days.map((d: any) => ({
                ...d,
                date: new Date(d.date).toISOString().split('T')[0]
            })) : [
                { date: new Date(order.startDate).toISOString().split('T')[0], startTime: '08:00', endTime: '16:00', startPlace: order.destination, endPlace: order.destination, country: 'CZ', breakfast: false, lunch: false, dinner: false, stravne: 0 }
            ],
            mileage: {
                vehicleId: order.vehicleId || '',
                initialKm: order.initialKm || 0,
                finalKm: order.finalKm || 0,
                fuelPrice: order.fuelPrice || 0
            },
            actualExpenses: order.expenses?.map((e: any) => ({
                date: new Date(e.date).toISOString().split('T')[0],
                type: e.type,
                amount: e.amount,
                currency: e.currency,
                desc: e.description
            })) || [],
            advanceDeduction: order.advances?.reduce((sum: number, a: any) => sum + a.amount, 0) || 0
        }
    });

    const watchedDays = useWatch({ control, name: 'days' }) || [];
    const watchedExpenses = useWatch({ control, name: 'actualExpenses' }) || [];
    const watchedExchangeRate = useWatch({ control, name: 'exchangeRate' }) || 25.30;
    const watchedAdvance = useWatch({ control, name: 'advanceDeduction' }) || 0;
    const watchedFinalKm = useWatch({ control, name: 'mileage.finalKm' }) || 0;
    const watchedInitialKm = useWatch({ control, name: 'mileage.initialKm' }) || 0;

    const calculateStravne = (day: any, rate: number) => {
        if (!day || !day.startTime || !day.endTime) return { amount: 0, currency: 'CZK', czk: 0 };

        try {
            const [h1, m1] = day.startTime.split(':').map(Number);
            const [h2, m2] = day.endTime.split(':').map(Number);
            const durationHours = (h2 + (m2 || 0) / 60) - (h1 + (m1 || 0) / 60);

            if (durationHours <= 0) return { amount: 0, currency: 'CZK', czk: 0 };

            const isDomestic = day.country === 'CZ' || !day.country;
            const currentExchangeRate = Number(rate) || 25.30;

            let base = 0;
            let reductionRate = 0;
            let currency = 'CZK';

            if (isDomestic) {
                currency = 'CZK';
                if (durationHours < 5) return { amount: 0, currency, czk: 0 };
                if (durationHours <= 12) {
                    base = domesticRates.tier1;
                    reductionRate = 0.70;
                } else if (durationHours <= 18) {
                    base = domesticRates.tier2;
                    reductionRate = 0.35;
                } else {
                    base = domesticRates.tier3;
                    reductionRate = 0.25;
                }
            } else {
                const countryData = foreignRates.find(r => r.code === day.country) || foreignRates[0];
                currency = countryData.currency;
                const baseInCurrency = countryData.base;

                if (durationHours <= 12) {
                    base = (baseInCurrency / 3);
                    reductionRate = 0.70;
                } else if (durationHours <= 18) {
                    base = (baseInCurrency * 2 / 3);
                    reductionRate = 0.35;
                } else {
                    base = baseInCurrency;
                    reductionRate = 0.25;
                }
            }

            const mealCount = [day.breakfast, day.lunch, day.dinner].filter(Boolean).length;
            const totalReduction = base * reductionRate * mealCount;
            const finalAmount = Math.max(0, base - totalReduction);

            return {
                amount: finalAmount,
                currency: currency,
                czk: isDomestic ? finalAmount : finalAmount * currentExchangeRate
            };
        } catch (e) {
            return { amount: 0, currency: 'CZK', czk: 0 };
        }
    };

    const totals = useMemo(() => {
        const days = watchedDays || [];
        const stravneTotal = days.reduce((sum: number, day: any) => {
            const val = calculateStravne(day, watchedExchangeRate).czk;
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        const expenses = watchedExpenses || [];
        const currentExchangeRate = Number(watchedExchangeRate) || 25.30;

        const expensesTotal = expenses.reduce((sum: number, exp: any) => {
            const amount = Number(exp.amount) || 0;
            const converted = exp.currency === 'EUR' ? amount * currentExchangeRate : amount;
            return sum + (isNaN(converted) ? 0 : converted);
        }, 0);

        return {
            stravne: stravneTotal,
            expenses: expensesTotal,
            grandTotal: stravneTotal + expensesTotal
        };
    }, [watchedDays, watchedExpenses, watchedExchangeRate]);

    const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({ control, name: "days" });
    const { fields: expenseFields, append: appendExpense, remove: removeExpense } = useFieldArray({ control, name: "actualExpenses" });

    const onSubmit = (data: any) => {
        startTransition(async () => {
            try {
                await saveSettlement(order.id, data);
                alert('Vyúčtování bylo uloženo do databáze');
            } catch (error) {
                console.error('Save failed:', error);
                alert('Chyba při ukládání');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <header className="flex justify-between items-end border-b pb-6">
                <div>
                    <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm mb-1 uppercase tracking-widest">
                        <span>Příkaz {order.id.slice(-8).toUpperCase()}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span>Vyúčtování</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{order.destination}</h1>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${order.status === 'Settled' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    Stav: {order.status === 'Settled' ? 'Vyúčtováno' : 'Schváleno (K vyúčtování)'}
                </div>
            </header>

            {/* ITINERÁŘ */}
            <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 text-slate-900">
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-500" />
                        Průběh cesty a stravné
                    </h2>
                    <button
                        type="button"
                        onClick={() => appendDay({ date: new Date().toISOString().split('T')[0], startTime: '08:00', endTime: '16:00', startPlace: '', endPlace: '', country: 'CZ', breakfast: false, lunch: false, dinner: false, stravne: 0 })}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold flex items-center hover:bg-blue-100 border border-blue-100 shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Přidat den
                    </button>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-blue-700">
                        <Info className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Nastavení výpočtu</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Směnný kurz (EUR/CZK)</p>
                            <input {...register('exchangeRate', { valueAsNumber: true })} type="number" step="0.01" className="w-20 bg-white border border-slate-200 rounded p-1 text-sm text-right font-black text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {dayFields.map((field, index) => {
                        const result = calculateStravne(watchedDays[index] || field, watchedExchangeRate);
                        return (
                            <div key={field.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end relative group">
                                <div className="lg:col-span-2 space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Datum & Země</label>
                                    <input type="date" {...register(`days.${index}.date`)} className="w-full p-2 bg-white rounded-xl border border-slate-200 font-bold text-slate-900 mb-2 text-xs" />
                                    <select {...register(`days.${index}.country`)} className="w-full p-2 bg-white rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-tight">
                                        <option value="CZ">CZ (Tuzemsko)</option>
                                        {foreignRates.map(r => (
                                            <option key={r.code} value={r.code}>{r.code} ({r.country})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Odjezdu</label>
                                        <div className="flex space-x-3">
                                            <input {...register(`days.${index}.startPlace`)} className="flex-1 p-2 bg-white rounded-xl border border-slate-200 text-sm font-medium" placeholder="Místo" />
                                            <input type="time" {...register(`days.${index}.startTime`)} className="w-[100px] p-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-center shrink-0" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Příjezdu</label>
                                        <div className="flex space-x-3">
                                            <input {...register(`days.${index}.endPlace`)} className="flex-1 p-2 bg-white rounded-xl border border-slate-200 text-sm font-medium" placeholder="Místo" />
                                            <input type="time" {...register(`days.${index}.endTime`)} className="w-[100px] p-2 bg-white rounded-xl border border-slate-200 text-sm font-medium text-center shrink-0" />
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 flex items-center space-x-4">
                                    <div className="flex-1 flex justify-around bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                        {['breakfast', 'lunch', 'dinner'].map((meal) => (
                                            <div key={meal} className="flex flex-col items-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">{meal[0].toUpperCase()}</span>
                                                <input type="checkbox" {...register(`days.${index}.${meal}` as any)} className="w-5 h-5 text-blue-600 rounded cursor-pointer" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 min-w-[100px]">
                                        <span className="text-lg font-black text-blue-600">
                                            {result.amount.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                        </span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase">{result.currency}</span>
                                    </div>
                                    <button type="button" onClick={() => removeDay(index)} className="p-3 text-slate-300 hover:text-red-500 rounded-xl">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* KM A VÝDAJE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 text-slate-900">
                    <h2 className="text-xl font-bold flex items-center border-b pb-4">
                        <Car className="w-5 h-5 mr-2 text-blue-500" />
                        Kilometry
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Start KM</label>
                            <input type="number" {...register('mileage.initialKm', { valueAsNumber: true })} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Konec KM</label>
                            <input type="number" {...register('mileage.finalKm', { valueAsNumber: true })} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold" />
                        </div>
                        <div className="col-span-2 bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center">
                            <span className="text-xs font-bold uppercase opacity-60">Ujeto celkem:</span>
                            <span className="text-xl font-black">{Math.max(0, watchedFinalKm - watchedInitialKm)} km</span>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 text-slate-900">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h2 className="text-xl font-bold flex items-center text-slate-900">
                            <Calculator className="w-5 h-5 mr-2 text-blue-500" />
                            Rekapitulace
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Stravné celkem:</span>
                            <span className="font-bold">{Math.round(totals.stravne)} CZK</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Ostatní výdaje:</span>
                            <span className="font-bold">{Math.round(totals.expenses)} CZK</span>
                        </div>
                        <div className="flex justify-between text-sm text-red-500 font-bold">
                            <span>Záloha k odečtení:</span>
                            <span>-{watchedAdvance} CZK</span>
                        </div>
                        <div className="pt-4 border-t flex justify-between items-center">
                            <span className="font-black uppercase tracking-tight">K výplatě:</span>
                            <span className="text-3xl font-black text-blue-600">
                                {Math.round(totals.grandTotal - Number(watchedAdvance))} CZK
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex justify-end pb-20">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black shadow-2xl transition-all hover:-translate-y-1 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    <span>{isPending ? 'Ukládání...' : 'Uložit a odeslat vyúčtování'}</span>
                </button>
            </div>
        </form>
    );
}
