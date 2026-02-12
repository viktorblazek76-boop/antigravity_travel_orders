'use client'

import React, { useState, useEffect } from 'react'
import { UserPlus } from 'lucide-react'
import { CreateUserModal, EditUserModal } from './ProjectModals'

export function UserClientSection({ availableUsers }: { availableUsers: any[] }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<any | null>(null)

    // Window event listener to trigger edit from server component table
    useEffect(() => {
        const handleEdit = (e: any) => {
            if (e.detail && e.detail.user) {
                setEditingUser(e.detail.user)
            }
        }
        window.addEventListener('edit-user', handleEdit)
        return () => window.removeEventListener('edit-user', handleEdit)
    }, [])

    return (
        <>
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-8 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold mb-1">Nový Zaměstnanec</h3>
                    <p className="text-white/40 text-sm">Založte nového pracovníka do systému projektových odměn.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                    <UserPlus size={18} />
                    Přidat Pracovníka
                </button>
            </div>

            <CreateUserModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                availableManagers={availableUsers}
            />

            {editingUser && (
                <EditUserModal
                    isOpen={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    user={editingUser}
                    availableManagers={availableUsers}
                />
            )}
        </>
    )
}
