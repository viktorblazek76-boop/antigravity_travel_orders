'use client'

import React from 'react'
import { Mail, User as UserIcon, Edit } from 'lucide-react'

export function UserTable({ users }: { users: any[] }) {
    const handleEdit = (user: any) => {
        window.dispatchEvent(new CustomEvent('edit-user', { detail: { user } }))
    }

    return (
        <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">
            <table className="w-full text-left font-sans border-collapse">
                <thead>
                    <tr className="bg-accent/30 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                        <th className="px-6 py-3">Jméno</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">E-mail</th>
                        <th className="px-6 py-3">Nadřízený</th>
                        <th className="px-6 py-3 text-right">Akce</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-accent/40 group transition-colors">
                            <td className="px-6 py-3.5 flex items-center gap-3">
                                <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                    <UserIcon size={14} />
                                </div>
                                <span className="font-semibold text-xs text-foreground">{user.name}</span>
                            </td>
                            <td className="px-6 py-3.5">
                                <span className="px-2 py-0.5 bg-accent/50 border border-border rounded-sm text-[9px] font-bold text-muted-foreground">
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-3.5 text-muted-foreground text-xs font-medium">
                                <div className="flex items-center gap-2"><Mail size={12} className="text-primary/60" /> {user.email}</div>
                            </td>
                            <td className="px-6 py-3.5 text-muted-foreground text-xs font-medium">
                                {user.manager?.name || <span className="italic text-muted-foreground/30">—</span>}
                            </td>
                            <td className="px-6 py-3.5 text-right">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="p-1.5 hover:bg-accent rounded-sm text-muted-foreground hover:text-primary transition-all"
                                    title="Upravit zaměstnance"
                                >
                                    <Edit size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
