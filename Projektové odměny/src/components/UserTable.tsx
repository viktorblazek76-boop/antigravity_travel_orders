'use client'

import React from 'react'
import { Mail, User as UserIcon, Edit } from 'lucide-react'

export function UserTable({ users }: { users: any[] }) {
    const handleEdit = (user: any) => {
        window.dispatchEvent(new CustomEvent('edit-user', { detail: { user } }))
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left font-sans">
                <thead>
                    <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/20 font-bold">
                        <th className="px-6 py-4">Jméno</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">E-mail</th>
                        <th className="px-6 py-4">Nadřízený</th>
                        <th className="px-6 py-4 text-right">Akce</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-white/2 group transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all">
                                    <UserIcon size={14} />
                                </div>
                                <span className="font-medium">{user.name}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold">
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-white/40 text-sm">
                                <div className="flex items-center gap-2 font-mono"><Mail size={12} /> {user.email}</div>
                            </td>
                            <td className="px-6 py-4 text-white/40 text-sm">
                                {user.manager?.name || <span className="italic text-white/10">—</span>}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400/40 hover:text-blue-400 transition-all"
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
