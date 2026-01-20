export interface Employee {
    id: string;
    employeeCode: string;
    firstName: string;
    surname: string;
    email: string;
}

export interface TravelOrder {
    id: string;
    sequenceNumber: string;
    type: 'Domestic' | 'Foreign';
    employeeId: string;
    travelPurpose: string;
    vehicleType?: string;
    vehicleId?: string;
    plannedStartDate: string;
    plannedEndDate: string;
    approvalStatus: 'Draft' | 'Requested' | 'Approved' | 'Rejected' | 'Archived';
    createdBy: string;
    createdOn: string;
}

export interface Expense {
    id: string;
    travelOrderId: string;
    expenseType: string;
    expenseDate: string;
    amount: number;
    currencyId: string;
    localAmount: number;
    description: string;
}
