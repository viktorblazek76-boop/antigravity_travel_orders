'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Settings,
    ChevronRight,
    User as UserIcon,
    Shield,
    ShieldCheck // Keep ShieldCheck as it's used in Sidebar
} from 'lucide-react'

type User = {
    id: string
    name: string
    role: string
}

export function Sidebar({
    currentUser,
    currentRole,
    allUsers = []
}: {
    currentUser?: User,
    currentRole: string,
    allUsers?: User[]
}) {
    const searchParams = useSearchParams()
    const currentUserId = searchParams.get('userId') || ''

    return (
        <aside className="w-68 border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col p-6 shrink-0">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/20">P</div>
                <span className="text-xl font-bold tracking-tight">Odměny</span>
            </div>

            <nav className="flex-1 space-y-1">
                <NavLink href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" activeRole={currentRole} activeUserId={currentUserId} />
                <NavLink href="/projects" icon={<Briefcase size={20} />} label="Projekty" activeRole={currentRole} activeUserId={currentUserId} />
                <NavLink href="/team" icon={<Users size={20} />} label="Můj Tým" activeRole={currentRole} activeUserId={currentUserId} />
                <NavLink href="/users" icon={<Shield size={20} />} label="Zaměstnanci" activeRole={currentRole} activeUserId={currentUserId} />
                <NavLink href="/settings" icon={<Settings size={20} />} label="Nastavení" activeRole={currentRole} activeUserId={currentUserId} />
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-3 flex items-center gap-2">
                        <ShieldCheck size={12} /> Simulace Role
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {['ID', 'PM', 'PRD', 'MLZ'].map((r) => (
                            <Link
                                key={r}
                                href={`?role=${r}`} // This clears userId when switching roles for simplicity
                                className={`text-[10px] text-center py-1.5 rounded-md border transition-all ${currentRole === r && !currentUserId
                                    ? 'bg-blue-600 border-blue-500 text-white font-bold'
                                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {r}
                            </Link>
                        ))}
                    </div>

                    <h4 className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2 flex items-center gap-2">
                        <UserIcon size={12} /> Simulace Uživatele
                    </h4>
                    <select
                        value={currentUserId}
                        onChange={(e) => {
                            const val = e.target.value
                            window.location.search = val ? `?userId=${val}` : `?role=${currentRole}`
                        }}
                        className="w-full bg-[#1a1c23] border border-white/10 rounded-lg py-2 px-3 text-[10px] outline-none text-white/60 focus:ring-1 focus:ring-blue-500/50"
                    >
                        <option value="">Vyberte uživatele...</option>
                        {allUsers.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center border border-white/20 shadow-md">
                        <UserIcon size={20} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate">{currentUser?.name || "Neznámý uživatel"}</p>
                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">{currentRole}</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

function NavLink({
    href,
    icon,
    label,
    activeRole,
    activeUserId
}: {
    href: string,
    icon: React.ReactNode,
    label: string,
    activeRole?: string,
    activeUserId?: string
}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Normalize pathnames for comparison
    const normalizedPathname = pathname === '/' ? '/' : pathname?.replace(/\/$/, '')
    const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '')

    const isActive = normalizedPathname === normalizedHref

    // Maintain parameters in the link
    const params = new URLSearchParams()
    if (activeUserId) {
        params.set('userId', activeUserId)
    } else if (activeRole) {
        params.set('role', activeRole)
    }

    const queryString = params.toString()
    const finalHref = queryString ? `${href}?${queryString}` : href

    return (
        <Link
            href={finalHref}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 cursor-pointer group ${isActive
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5'
                : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
        >
            <div className={`${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'} transition-colors`}>
                {icon}
            </div>
            <span className={`font-semibold text-sm tracking-wide ${isActive ? 'text-white' : ''}`}>{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full"></div>}
        </Link>
    )
}
