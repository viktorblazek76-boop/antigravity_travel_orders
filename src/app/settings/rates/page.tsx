'use client';

import { ChevronLeft, Database, Save, Globe, Info, Plus, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState, useTransition } from 'react';
import { getRateSettings, updateRateSettings } from '@/app/actions/settings';

export default function RatesSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: {
            domestic: {
                tier1: 140, // 5-12h
                tier2: 212, // 12-18h
                tier3: 333, // >18h
            },
            foreignRates: [] as any[],
            exchangeRate: 25.30
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "foreignRates"
    });

    // Load data from DB
    useEffect(() => {
        async function loadData() {
            try {
                const settings = await getRateSettings();

                const domestic = {
                    tier1: settings.find(s => s.type === 'domestic' && s.code === 'tier1')?.baseRate || 140,
                    tier2: settings.find(s => s.type === 'domestic' && s.code === 'tier2')?.baseRate || 212,
                    tier3: settings.find(s => s.type === 'domestic' && s.code === 'tier3')?.baseRate || 333,
                    id1: settings.find(s => s.type === 'domestic' && s.code === 'tier1')?.id,
                    id2: settings.find(s => s.type === 'domestic' && s.code === 'tier2')?.id,
                    id3: settings.find(s => s.type === 'domestic' && s.code === 'tier3')?.id,
                };

                const foreignRates = settings
                    .filter(s => s.type === 'foreign')
                    .map(s => ({
                        id: s.id,
                        country: s.country,
                        code: s.code,
                        currency: s.currency,
                        base: s.baseRate
                    }));

                reset({
                    domestic: {
                        tier1: domestic.tier1,
                        tier2: domestic.tier2,
                        tier3: domestic.tier3,
                    },
                    foreignRates,
                    exchangeRate: 25.30 // This could also be a setting
                });

                // Keep track of IDs for domestic settings in a hidden way or just use reset correctly
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [reset]);

    const onSubmit = (data: any) => {
        startTransition(async () => {
            try {
                // Map back to DB structure
                const payload = [
                    { type: 'domestic', code: 'tier1', baseRate: data.domestic.tier1, currency: 'CZK' },
                    { type: 'domestic', code: 'tier2', baseRate: data.domestic.tier2, currency: 'CZK' },
                    { type: 'domestic', code: 'tier3', baseRate: data.domestic.tier3, currency: 'CZK' },
                    ...data.foreignRates.map((r: any) => ({
                        id: r.id,
                        type: 'foreign',
                        code: r.code || r.country.substring(0, 2).toUpperCase(),
                        country: r.country,
                        baseRate: r.base,
                        currency: r.currency
                    }))
                ];

                await updateRateSettings(payload);
                alert('Sazby byly uloženy do databáze');
            } catch (error) {
                console.error('Save failed:', error);
                alert('Chyba při ukládání');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="flex items-center space-x-4">
                <Link href="/settings" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <ChevronLeft className="w-6 h-6 text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sazby a náhrady</h1>
                    <p className="text-slate-500">Konfigurace výpočtů v databázi</p>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COL: DOMESTIC & EXCHANGE */}
                <div className="lg:col-span-4 space-y-8">
                    {/* DOMESTIC RATES */}
                    <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
                        <h2 className="text-xl font-bold flex items-center border-b pb-4">
                            <Database className="w-5 h-5 mr-2 text-blue-500" />
                            Tuzemské stravné (CZK)
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-sm font-bold text-slate-600">5 – 12 hodin</span>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        {...register('domestic.tier1')}
                                        className="w-20 p-2 rounded-xl border border-slate-200 text-right font-black"
                                    />
                                    <span className="text-xs font-bold text-slate-400">Kč</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-sm font-bold text-slate-600">12 – 18 hodin</span>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        {...register('domestic.tier2')}
                                        className="w-20 p-2 rounded-xl border border-slate-200 text-right font-black"
                                    />
                                    <span className="text-xs font-bold text-slate-400">Kč</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-sm font-bold text-slate-600">Nad 18 hodin</span>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        {...register('domestic.tier3')}
                                        className="w-20 p-2 rounded-xl border border-slate-200 text-right font-black"
                                    />
                                    <span className="text-xs font-bold text-slate-400">Kč</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* EXCHANGE RATE */}
                    <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
                        <h2 className="text-xl font-bold flex items-center border-b border-white/10 pb-4">
                            <Globe className="w-5 h-5 mr-2 text-blue-400" />
                            Směnný kurz
                        </h2>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Výchozí kurz pro vyúčtování (EUR/CZK)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('exchangeRate')}
                                className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 font-bold text-2xl outline-none focus:bg-white/20"
                            />
                        </div>
                    </section>
                </div>

                {/* RIGHT COL: FOREIGN COUNTRIES */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h2 className="text-xl font-bold flex items-center">
                                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                                Zahraniční sazby (Denní základna)
                            </h2>
                            <button
                                type="button"
                                onClick={() => append({ country: '', currency: 'EUR', base: 45 })}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold flex items-center hover:bg-blue-100 transition-all border border-blue-100 shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Přidat zemi
                            </button>
                        </div>

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-center animate-in slide-in-from-left-4 duration-300">
                                    <div className="md:col-span-5">
                                        <input
                                            {...register(`foreignRates.${index}.country`)}
                                            placeholder="Země"
                                            className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <select
                                            {...register(`foreignRates.${index}.currency`)}
                                            className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm font-bold"
                                        >
                                            <option value="EUR">EUR</option>
                                            <option value="USD">USD</option>
                                            <option value="GBP">GBP</option>
                                            <option value="CHF">CHF</option>
                                            <option value="CZK">CZK</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                {...register(`foreignRates.${index}.base`)}
                                                className="w-full p-3 bg-white rounded-xl border border-slate-200 text-sm font-black text-right"
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Sazba</span>
                                        </div>
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-end sticky bottom-0 bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                            <span>{isPending ? 'Ukládání...' : 'Uložit všechny parametry'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
