'use client';

import { useTransition } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Calendar, User, Briefcase, Globe, Info, Save, Send,
    Clock, Plus, Trash2, Landmark, CreditCard, MapPin, ArrowRight, Loader2
} from 'lucide-react';
import { createOrder } from '@/app/actions/orders';

const orderSchema = z.object({
    type: z.enum(['Domestic', 'Foreign']),
    employeeId: z.string().min(1, 'Povinné pole'),
    approverName: z.string().min(1, 'Vyberte schvalovatele'),
    purpose: z.string().min(3, 'Účel cesty musí mít alespoň 3 znaky'),
    coTravelers: z.string().optional(),
    startDate: z.string().min(1, 'Vyberte datum'),
    startTime: z.string().min(1, 'Vyberte čas'),
    endDate: z.string().min(1, 'Vyberte datum'),
    endTime: z.string().min(1, 'Vyberte čas'),
    destination: z.string().min(1, 'Zadejte cílové místo'),
    routeSegments: z.array(z.object({
        from: z.string().min(1, 'Zadejte výchozí místo'),
        to: z.string().min(1, 'Zadejte cílové místo'),
        transportType: z.string(),
        vehicleId: z.string().optional(),
    })).min(1, 'Přidejte alespoň jeden úsek cesty'),
    plannedExpenses: z.array(z.object({
        type: z.string(),
        date: z.string().min(1, 'Vyberte datum'),
        description: z.string(),
        amount: z.number().min(0),
        currency: z.string()
    })),
    advances: z.array(z.object({
        amount: z.number().min(0),
        currency: z.string(),
        dueDate: z.string().optional(),
        paymentMethod: z.string(),
    }))
});

export default function NewOrderPage() {
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            type: 'Domestic',
            destination: '',
            purpose: '',
            approverName: 'Jan Novák',
            routeSegments: [{ from: '', to: '', transportType: 'company', vehicleId: '' }],
            plannedExpenses: [],
            advances: [{ amount: 0, currency: 'CZK', paymentMethod: 'Cash' }]
        }
    });

    const { fields: routeFields, append: appendRoute, remove: removeRoute } = useFieldArray({
        control,
        name: "routeSegments"
    });

    const { fields: expenseFields, append: appendExpense, remove: removeExpense } = useFieldArray({
        control,
        name: "plannedExpenses"
    });

    const { fields: advanceFields, append: appendAdvance, remove: removeAdvance } = useFieldArray({
        control,
        name: "advances"
    });

    const travelType = watch('type');

    const onSubmit = (data: any) => {
        startTransition(async () => {
            try {
                await createOrder({
                    ...data,
                    leg1_date: data.startDate,
                    leg2_date: data.endDate
                });
                // If successful, the redirect inside createOrder will trigger
            } catch (error: any) {
                // Ignore redirect errors which are expected when redirect() is called in server action
                if (error.digest?.startsWith('NEXT_REDIRECT')) {
                    return;
                }
                console.error('Failed to create order:', error);
                alert('Chyba při ukládání do databáze. Podrobnosti v konzoli.');
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nový cestovní příkaz</h1>
                    <p className="text-slate-500 mt-2 text-lg">Zadejte údaje do databáze (REQ-01)</p>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* SECTION 1: ZÁKLADNÍ ÚDAJE */}
                <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8 text-slate-900">
                    <h2 className="text-xl font-bold flex items-center border-b pb-4">
                        <Info className="w-5 h-5 mr-2 text-blue-500" />
                        Základní informace
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Typ cesty */}
                        <div className="space-y-4 col-span-full">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Typ cesty</label>
                            <div className="flex space-x-4">
                                <label className={`flex-1 flex items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${travelType === 'Domestic' ? 'border-blue-500 bg-blue-50/30 text-blue-700 shadow-inner' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                                    <input type="radio" {...register('type')} value="Domestic" className="hidden" />
                                    <Briefcase className="w-6 h-6 mr-3" />
                                    <span className="font-bold text-lg">Tuzemská</span>
                                </label>
                                <label className={`flex-1 flex items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${travelType === 'Foreign' ? 'border-blue-500 bg-blue-50/30 text-blue-700 shadow-inner' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                                    <input type="radio" {...register('type')} value="Foreign" className="hidden" />
                                    <Globe className="w-6 h-6 mr-3" />
                                    <span className="font-bold text-lg">Zahraniční</span>
                                </label>
                            </div>
                        </div>

                        {/* Zaměstnanec */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Zaměstnanec</label>
                                <select {...register('employeeId')} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium appearance-none">
                                    <option value="1">Viktor Blabla (vblabla) - IT Konzultant</option>
                                    <option value="2">Jan Novák (jnovak) - Projektový manažer</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Schvalující</label>
                                <select {...register('approverName')} className={`w-full p-4 rounded-xl border ${errors.approverName ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'} focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium appearance-none`}>
                                    <option value="Jan Novák">Jan Novák (Projektový manažer)</option>
                                    <option value="Viktor Blabla">Viktor Blabla (IT Konzultant)</option>
                                    <option value="Management">Management</option>
                                </select>
                                {errors.approverName && <p className="text-red-500 text-xs font-bold">{errors.approverName.message as string}</p>}
                            </div>
                        </div>

                        {/* Cílové místo */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Cíl cesty (Město/Země)</label>
                            <input {...register('destination')} placeholder="Např. Praha nebo Berlín, DE" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" />
                        </div>

                        {/* Účel */}
                        <div className="space-y-2 col-span-full">
                            <label className="text-sm font-bold text-slate-700">Účel cesty</label>
                            <input {...register('purpose')} placeholder="Např. Kick-off meeting projektu Perihelion" className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none" />
                        </div>

                        {/* ČASOVÝ PLÁN */}
                        <div className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2 md:col-span-1">
                                <label className="text-sm font-bold text-slate-700 flex items-center"><Calendar className="w-4 h-4 mr-1 text-blue-500" /> Start Datum</label>
                                <input type="date" {...register('startDate')} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50" />
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <label className="text-sm font-bold text-slate-700 flex items-center"><Clock className="w-4 h-4 mr-1 text-blue-500" /> Start Čas</label>
                                <input type="time" {...register('startTime')} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50" />
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <label className="text-sm font-bold text-slate-700 flex items-center"><Calendar className="w-4 h-4 mr-1 text-blue-500" /> Konec Datum</label>
                                <input type="date" {...register('endDate')} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50" />
                            </div>
                            <div className="space-y-2 md:col-span-1">
                                <label className="text-sm font-bold text-slate-700 flex items-center"><Clock className="w-4 h-4 mr-1 text-blue-500" /> Konec Čas</label>
                                <input type="time" {...register('endTime')} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ÚSEKY CESTY */}
                <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 text-slate-900">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h2 className="text-xl font-bold flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                            Úseky cesty (trasa)
                        </h2>
                        <button
                            type="button"
                            onClick={() => appendRoute({ from: '', to: '', transportType: 'company', vehicleId: '' })}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold flex items-center hover:bg-blue-100 transition-all border border-blue-100"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Přidat úsek
                        </button>
                    </div>

                    <div className="space-y-4">
                        {routeFields.map((field, index) => (
                            <div key={field.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                    <div className="md:col-span-4 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Z (místo)</label>
                                        <input {...register(`routeSegments.${index}.from`)} placeholder="Např. Ostrava" className="w-full p-3 bg-white rounded-lg border border-slate-200 text-sm font-medium" />
                                    </div>
                                    <div className="md:col-span-1 flex justify-center mt-4">
                                        <ArrowRight className="w-5 h-5 text-slate-300" />
                                    </div>
                                    <div className="md:col-span-4 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Do (místo)</label>
                                        <input {...register(`routeSegments.${index}.to`)} placeholder="Např. Praha" className="w-full p-3 bg-white rounded-lg border border-slate-200 text-sm font-medium" />
                                    </div>
                                    <div className="md:col-span-3 flex items-end space-x-2">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Doprava</label>
                                            <select {...register(`routeSegments.${index}.transportType`)} className="w-full p-3 bg-white rounded-lg border border-slate-200 text-sm font-medium">
                                                <option value="company">Služební vůz</option>
                                                <option value="private">Soukromý vůz</option>
                                                <option value="public">Veřejná doprava</option>
                                            </select>
                                        </div>
                                        {routeFields.length > 1 && (
                                            <button type="button" onClick={() => removeRoute(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ZÁLOHA */}
                <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6 text-slate-900">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h2 className="text-xl font-bold flex items-center">
                            <Landmark className="w-5 h-5 mr-2 text-blue-500" />
                            Záloha na cestu
                        </h2>
                        <button
                            type="button"
                            onClick={() => appendAdvance({ amount: 0, currency: 'CZK', paymentMethod: 'Cash' })}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold flex items-center hover:bg-blue-100 transition-all border border-blue-100"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Přidat zálohu
                        </button>
                    </div>

                    <div className="space-y-4">
                        {advanceFields.map((field, index) => (
                            <div key={field.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6 relative group">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Výše zálohy</label>
                                        <div className="flex space-x-2">
                                            <input type="number" {...register(`advances.${index}.amount`, { valueAsNumber: true })} className="flex-1 p-3 rounded-xl border border-slate-200 bg-white" />
                                            <select {...register(`advances.${index}.currency`)} className="p-3 rounded-xl border border-slate-200 bg-white">
                                                <option>CZK</option>
                                                <option>EUR</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Způsob vyplacení</label>
                                        <select {...register(`advances.${index}.paymentMethod`)} className="w-full p-3 rounded-xl border border-slate-200 bg-white">
                                            <option value="Cash">V hotovosti</option>
                                            <option value="Bank">Bankovní účet</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end justify-end">
                                        {advanceFields.length > 0 && (
                                            <button type="button" onClick={() => removeAdvance(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end space-x-4 pb-12">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                        <span>{isPending ? 'Ukládání...' : 'Vytvořit cestovní příkaz'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
