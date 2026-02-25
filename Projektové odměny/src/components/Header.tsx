'use client'

import React from 'react'
import { Bell, Search } from 'lucide-react'

export function Header({ title, currentRole, userName }: { title: string, currentRole: string, userName?: string | null }) {
    return (
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-white z-20 shrink-0">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-black text-foreground tracking-tight">{title}</h1>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-widest">v2.2 - D365 REDESIGN</span>
                <div className="flex items-center gap-2 bg-accent/50 px-2 py-0.5 rounded-sm border border-border">
                    <span className="text-muted-foreground text-[9px] font-bold">
                        ROLE: {currentRole}
                    </span>
                    {userName && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-border"></div>
                            <span className="text-foreground/70 text-[9px] font-bold uppercase tracking-wider">{userName}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Hledat..."
                        className="bg-accent/30 border border-border rounded-sm py-1.5 pl-9 pr-4 w-64 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 text-xs"
                    />
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-sm transition-all relative">
                    <Bell size={18} />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-white"></div>
                </button>
            </div>
        </header>
    )
}
