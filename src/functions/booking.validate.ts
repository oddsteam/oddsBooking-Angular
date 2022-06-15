import * as dayjs from 'dayjs'
import { BookingService } from 'src/app/booking.service'

export class BookingValidate {
    constructor() {}

    static textAutoFormat(term: string): string {
        let nameFormatter = term.trimStart().toLowerCase().split(' ')
        for (let _i = 0; _i < nameFormatter.length; _i++) {
            nameFormatter[_i] =
                nameFormatter[_i].charAt(0).toUpperCase() + nameFormatter[_i].substring(1)
        }
        return nameFormatter.join(' ')
    }

    static checkReasonInput(term: string) {
        let reasonFormatter = term.trim()
        return reasonFormatter
    }

    static checkPhoneNumberInput(term: string): string {
        const pattern = /^[0-9]*$/
        let phoneNumberFormatted = term
        if (!pattern.test(phoneNumberFormatted)) {
            phoneNumberFormatted = phoneNumberFormatted.replace(/[^0-9]/g, '')
        }
        return phoneNumberFormatted
    }

    static convertDateToString(date: Date): string {
        if (!date) return ''
        const next2WeekDate = dayjs(date).toDate()
        return dayjs(next2WeekDate).format('YYYY-MM-DDTHH:mm')
    }

    static getCustomTime(hour: number, minute: number): Date {
        return dayjs().set('hour', hour).set('minute', minute).toDate()
    }

    static getDefaultFromTime(startDate: Date): Date {
        return BookingService.isWeekend(startDate)
            ? this.getCustomTime(9, 0)
            : this.getCustomTime(18, 0)
    }

    static getDefaultToTime(startDate: Date, startTime: Date, endDate: Date): Date {
        if (!dayjs(endDate).isSame(startDate, 'date')) {
            return endDate.getDay() === 0 ? this.getCustomTime(21, 0) : this.getCustomTime(6, 0)
        } else {
            if (BookingService.isWeekend(startDate) && BookingService.isWeekend(endDate)) {
                return this.getCustomTime(21, 0)
            } else if (
                !BookingService.isWeekend(startDate) &&
                !BookingService.isWeekend(endDate) &&
                startTime.getHours() < 6
            ) {
                return this.getCustomTime(6, 0)
            }
            return this.getCustomTime(23, 30)
        }
    }
}
