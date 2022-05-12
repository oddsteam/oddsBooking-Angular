export interface BookingDetail {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    reason: string;
    room: string;
    dateStart: Date;
    dateEnd: Date;
}

export interface Detail {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    reason: string;
    room: string;
    dateStart: Date;
    dateEnd: Date;
    status: string;
}