'use client'

import React from 'react'
import { Bell, Search } from 'lucide-react'

export function Header({ title, currentRole, userName }: { title: string, currentRole: string, userName?: string | null }) {
    return (
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/20 backdrop-blur-md z-20 shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded border border-white/10">
                    <span className="text-white/40 text-[10px] font-mono">
                        ROLE: {currentRole}
                    </span>
                    {userName && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-white/20"></div>
                            <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{userName}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Hledat..."
                        className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 w-72 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-white/10 text-sm"
                    />
                </div>
                <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all relative">
                    <Bell size={20} />
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#12141a]"></div>
                </button>
            </div>
        </header>
    )
}
