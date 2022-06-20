import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { BookingUtility } from './booking.utility'
import * as dayjs from 'dayjs'

describe('BookingUtility', () => {
    let utility: BookingUtility
    beforeEach(() => {
        TestBed.configureTestingModule({})
        utility = new BookingUtility()
    })

    it('startTimeOption input[startDate(weekday)] #range should return [18:00,18:30,...,21:30,22:00]', () => {
        const expectedResult = [
            { time: '18:00', duration: '0.5 hr' },
            { time: '18:30', duration: '1 hr' },
            { time: '19:00', duration: '1.5 hrs' },
            { time: '19:30', duration: '2 hrs' },
            { time: '20:00', duration: '2.5 hrs' },
            { time: '20:30', duration: '3 hrs' },
            { time: '21:00', duration: '3.5 hrs' },
            { time: '21:30', duration: '4 hrs' },
            { time: '22:00', duration: '4.5 hrs' },
        ]
        const startDate = dayjs('6 Jul 2022').toDate()
        const result = BookingUtility.timeOption(startDate)

        expect(result).toEqual(expectedResult)
    })

    it('startTimeOption input[startDate(weekend)] #range should return [9:00,9:30,...,19:30,20:00]', () => {
        const expectedResult = [
            { time:'9:00', duration: '0.5 hr' },
            { time:'9:30', duration: '1 hr' },
            { time:'10:00', duration: '1.5 hrs' },
            { time:'10:30', duration: '2 hrs' },
            { time:'11:00', duration: '2.5 hrs' },
            { time:'11:30', duration: '3 hrs' },
            { time:'12:00', duration: '3.5 hrs' },
            { time:'12:30', duration: '4 hrs' },
            { time:'13:00', duration: '4.5 hrs' },
            { time:'13:30', duration: '5 hrs' },
            { time:'14:00', duration: '5.5 hrs' },
            { time:'14:30', duration: '6 hrs' },
            { time:'15:00', duration: '6.5 hrs' },
            { time:'15:30', duration: '7 hrs' },
            { time:'16:00', duration: '7.5 hrs' },
            { time:'16:30', duration: '8 hrs' },
            { time:'17:00', duration: '8.5 hrs' },
            { time:'17:30', duration: '9 hrs' },
            { time:'18:00', duration: '9.5 hrs' },
            { time:'18:30', duration: '10 hrs' },
            { time:'19:00', duration: '10.5 hrs' },
            { time:'19:30', duration: '11 hrs' },
            { time:'20:00', duration: '11.5 hrs' }
        ]
        const startDate = dayjs('25 Jun 2022').toDate()
        const result = BookingUtility.timeOption(startDate)

        expect(result).toEqual(expectedResult)
    })

    it('endTimeOption input[startDate(saturday), startTime, endDate(saturday)] #range should return [11:30,12:00,...,20:30,21:00]', () => {
        const expectedResult = [
            { time: '11:30', duration: '1 hr' },
            { time: '12:00', duration: '1.5 hrs' },
            { time: '12:30', duration: '2 hrs' },
            { time: '13:00', duration: '2.5 hrs' },
            { time: '13:30', duration: '3 hrs' },
            { time: '14:00', duration: '3.5 hrs' },
            { time: '14:30', duration: '4 hrs' },
            { time: '15:00', duration: '4.5 hrs' },
            { time: '15:30', duration: '5 hrs' },
            { time: '16:00', duration: '5.5 hrs' },
            { time: '16:30', duration: '6 hrs' },
            { time: '17:00', duration: '6.5 hrs' },
            { time: '17:30', duration: '7 hrs' },
            { time: '18:00', duration: '7.5 hrs' },
            { time: '18:30', duration: '8 hrs' },
            { time: '19:00', duration: '8.5 hrs' },
            { time: '19:30', duration: '9 hrs' },
            { time: '20:00', duration: '9.5 hrs' },
            { time: '20:30', duration: '10 hrs' },
            { time: '21:00', duration: '10.5 hrs' }
        ]
        const startDate = dayjs('25 Jun 2022').toDate()
        const startTime = '10:30'
        const endDate = dayjs('25 Jun 2022').toDate()
        const result = BookingUtility.timeOption(startDate, startTime, endDate)

        expect(result).toEqual(expectedResult)
    })

    it('endTimeOption input[startDate(saturday), startTime, endDate(sunday)] #range should return [9:30,10:00,...,20:30,21:00]', () => {
        const expectedResult = [
            { time: '9:30', duration: '11 hrs' },
            { time: '10:00', duration: '11.5 hrs' },
            { time: '10:30', duration: '12 hrs' },
            { time: '11:00', duration: '12.5 hrs' },
            { time: '11:30', duration: '13 hrs' },
            { time: '12:00', duration: '13.5 hrs' },
            { time: '12:30', duration: '14 hrs' },
            { time: '13:00', duration: '14.5 hrs' },
            { time: '13:30', duration: '15 hrs' },
            { time: '14:00', duration: '15.5 hrs' },
            { time: '14:30', duration: '16 hrs' },
            { time: '15:00', duration: '16.5 hrs' },
            { time: '15:30', duration: '17 hrs' },
            { time: '16:00', duration: '17.5 hrs' },
            { time: '16:30', duration: '18 hrs' },
            { time: '17:00', duration: '18.5 hrs' },
            { time: '17:30', duration: '19 hrs' },
            { time: '18:00', duration: '19.5 hrs' },
            { time: '18:30', duration: '20 hrs' },
            { time: '19:00', duration: '20.5 hrs' },
            { time: '19:30', duration: '21 hrs' },
            { time: '20:00', duration: '21.5 hrs' },
            { time: '20:30', duration: '22 hrs' },
            { time: '21:00', duration: '22.5 hrs' }
        ]
        const startDate = dayjs('25 Jun 2022').toDate()
        const startTime = '10:30'
        const endDate = dayjs('26 Jun 2022').toDate()
        const result = BookingUtility.timeOption(startDate, startTime, endDate)

        expect(result).toEqual(expectedResult)
    })
})
