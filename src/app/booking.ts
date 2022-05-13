export interface BookingDetail {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    reason: string;
    room: string;
    startDate: Date;
    endDate: Date;
}

export interface Detail {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    reason: string;
    room: string;
    startDate: Date;
    endDate: Date;
    status: string;
}