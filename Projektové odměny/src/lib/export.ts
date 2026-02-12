import * as XLSX from 'xlsx'

export function exportProjectToExcel(project: any) {
    // Prepare data structure for Excel
    const header = [
        'Pracovník / Role',
        ...project.phases.map((p: any) => {
            const dateStr = p.dueDate ? ` (${new Date(p.dueDate).toLocaleDateString('cs-CZ')})` : ''
            return `${p.name}${dateStr}`
        }),
        'Celkem'
    ]

    // Group rewards by user
    const userIds = Array.from(new Set(project.rewards.map((r: any) => r.userId)))

    const rows = userIds.filter(id => id !== null).map(userId => {
        const userRewards = project.rewards.filter((r: any) => r.userId === userId && !r.isTeamReward)
        const userName = userRewards[0]?.user.name
        const role = userRewards[0]?.roleInProject || ''

        const phaseAmounts = project.phases.map((phase: any) => {
            const reward = userRewards.find((r: any) => r.phaseId === phase.id)
            if (!reward) return 0

            const statusLabel = reward.status === 'PAID' ? '(Vyplaceno)' : '(Nevyplaceno)'
            // Return string for Excel cell to include status
            return `${reward.amount.toLocaleString('cs-CZ')} ${statusLabel}`
        })

        const total = userRewards.reduce((sum: number, r: any) => sum + r.amount, 0)
        const totalStr = `${total.toLocaleString('cs-CZ')} Kč`

        return [`${userName} (${role})`, ...phaseAmounts, totalStr]
    })

    // 1. Calculate Individual Totals
    const individualPhaseTotals = project.phases.map((phase: any) => {
        return project.rewards
            .filter((r: any) => r.phaseId === phase.id && !r.isTeamReward)
            .reduce((sum: number, r: any) => sum + r.amount, 0)
    })
    const individualGrandTotal = individualPhaseTotals.reduce((sum: number, val: number) => sum + val, 0)
    const individualRow = ['Individuální odměny celkem', ...individualPhaseTotals, individualGrandTotal]

    // 2. Add Team Pool row
    const teamRewards = project.rewards.filter((r: any) => r.isTeamReward)
    const teamPhaseAmounts = project.phases.map((phase: any) => {
        const trs = teamRewards.filter((r: any) => r.phaseId === phase.id)
        return trs.reduce((sum: number, r: any) => sum + r.amount, 0)
    })
    const teamRow = ['Týmová odměna - čerpání (Pool)', ...teamPhaseAmounts, '—']

    // 3. Calculate Project Grand Total (Individual + Total Pool)
    const grandPhaseTotals = project.phases.map((_: any, idx: number) => {
        return individualPhaseTotals[idx] + teamPhaseAmounts[idx]
    })
    const grandTotal = individualGrandTotal + (project.teamBudget || 0)
    const grandTotalRow = ['Celková hodnota projektu', ...grandPhaseTotals, grandTotal]

    const finalRows = [...rows, individualRow, teamRow, grandTotalRow]

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([
        [`Projekt: ${project.name}`],
        [`Zákazník: ${project.customer}`],
        [`Týmový rozpočet: ${project.teamBudget || 0} Kč`],
        [],
        header,
        ...finalRows
    ])

    // Create workbook and download
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Odměny')

    // Generate file name
    const fileName = `Odmeny_${project.name.replace(/\s+/g, '_')}.xlsx`

    XLSX.writeFile(wb, fileName)
}
