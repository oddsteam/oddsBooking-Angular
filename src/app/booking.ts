export interface BookingDetail {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    reason: string
    room: string
    startDate: Date
    endDate: Date
    status: boolean
}

export interface BookingDetailRes {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    reason: string
    room: string
    startDate: Date
    endDate: Date
    status: boolean
    createdAt: Date
    updatedAt: Date
}

export interface BookingRes{
    status : number
    data : BookingDetailRes
}


