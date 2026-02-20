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
            <div className="bg-white border-l-4 border-l-primary border-y border-r border-border rounded-sm p-6 flex justify-between items-center shadow-sm">
                <div>
                    <h3 className="text-sm font-bold mb-1 text-foreground">Nový Zaměstnanec</h3>
                    <p className="text-muted-foreground text-[11px] font-medium">Založte nového pracovníka do systému projektových odměn.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-sm text-xs font-semibold shadow-sm transition-all"
                >
                    <UserPlus size={16} />
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
