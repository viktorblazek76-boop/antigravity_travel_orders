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
        <aside className="w-64 border-r border-border bg-sidebar flex flex-col shrink-0">
            <div className="flex items-center gap-2 h-14 px-6 border-b border-border bg-white">
                <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center font-bold text-xs text-white">PO</div>
                <span className="text-sm font-semibold tracking-tight text-foreground">Projektové odměny</span>
            </div>

            <nav className="flex-1 p-2 space-y-0.5 mt-2">
                <NavLink href="/" icon={<LayoutDashboard size={18} />} label="Domů" activeRole={currentRole} activeUserId={currentUserId} />
                <NavLink href="/projects" icon={<Briefcase size={18} />} label="Projekty" activeRole={currentRole} activeUserId={currentUserId} />
                <NavLink href="/team" icon={<Users size={18} />} label="Můj Tým" activeRole={currentRole} activeUserId={currentUserId} />
                <NavLink href="/users" icon={<Shield size={18} />} label="Zaměstnanci" activeRole={currentRole} activeUserId={currentUserId} />
                <NavLink href="/settings" icon={<Settings size={18} />} label="Nastavení" activeRole={currentRole} activeUserId={currentUserId} />
            </nav>

            <div className="mt-auto p-4 border-t border-border bg-sidebar-accent/30 space-y-3">
                <div className="bg-white border border-border shadow-sm rounded-sm p-3">
                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 flex items-center gap-2">
                        <ShieldCheck size={12} /> Simulace Role
                    </h4>
                    <div className="grid grid-cols-2 gap-1 mb-3">
                        {['ID', 'PM', 'PRD', 'MLZ'].map((r) => (
                            <Link
                                key={r}
                                href={`?role=${r}`}
                                className={`text-[10px] text-center py-1 rounded-sm border transition-all ${currentRole === r && !currentUserId
                                    ? 'bg-primary border-primary text-white font-semibold'
                                    : 'bg-white border-border text-foreground/70 hover:bg-accent'
                                    }`}
                            >
                                {r}
                            </Link>
                        ))}
                    </div>

                    <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2 flex items-center gap-2">
                        <UserIcon size={12} /> Simulace Uživatele
                    </h4>
                    <select
                        value={currentUserId}
                        onChange={(e) => {
                            const val = e.target.value
                            window.location.search = val ? `?userId=${val}` : `?role=${currentRole}`
                        }}
                        className="w-full bg-white border border-border rounded-sm py-1.5 px-2 text-[10px] outline-none text-foreground focus:ring-1 focus:ring-primary/30"
                    >
                        <option value="">Vyberte uživatele...</option>
                        {allUsers.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3 px-1 py-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border border-border">
                        <UserIcon size={16} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-semibold text-foreground truncate">{currentUser?.name || "Neznámý uživatel"}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{currentRole}</p>
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

    const normalizedPathname = pathname === '/' ? '/' : pathname?.replace(/\/$/, '')
    const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '')
    const isActive = normalizedPathname === normalizedHref

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
            className={`flex items-center gap-3 px-3 py-2 rounded-sm transition-colors cursor-pointer group relative ${isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground/80 hover:bg-accent hover:text-foreground'
                }`}
        >
            {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full"></div>}
            <div className={`${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {icon}
            </div>
            <span className="text-xs tracking-tight">{label}</span>
        </Link>
    )
}
