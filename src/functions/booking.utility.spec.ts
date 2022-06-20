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

    it('startTimeOption input[startDate(weekday)] #range should return [18,19,...,21,22]' , () =>{
        const expectedResult = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"]
        const startDate = dayjs("22 Jun 2022").toDate()
        const result = BookingUtility.timeOption(startDate)

        //expect(result).toEqual(expectedResult)
    })

    it('startTimeOption input[startDate(weekend)] #range should return [9,10,...,19,20]' , () =>{
        const expectedResult = ["9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00", "18:30", "19:00", "19:30", "20:00"]
        const startDate = dayjs("25 Jun 2022").toDate()
        const result = BookingUtility.timeOption(startDate)

        //expect(result).toEqual(expectedResult)
    })

    it('endTimeOption input[startDate(saturday), startTime, endDate(saturday)] #range should return [18,19,...,21,22,23]' , () =>{
        const expectedResult = ["11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00", "18:30", "19:00", "19:30", "20:00","20:30","21:00"]
        const startDate = dayjs("25 Jun 2022").toDate()
        const startTime = "10:30"
        const endDate = dayjs("25 Jun 2022").toDate()
        const result = BookingUtility.timeOption(startDate, startTime, endDate)
        
        //expect(result).toEqual(expectedResult)
    })

    it('endTimeOption input[startDate(saturday), startTime, endDate(saturday)] #range should return [18,19,...,21,22,23]' , () =>{
        const expectedResult = ["11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00", "18:30", "19:00", "19:30", "20:00","20:30","21:00"]
        const startDate = dayjs("25 Jun 2022").toDate()
        const startTime = "10:30"
        const endDate = dayjs("25 Jun 2022").toDate()
        const result = BookingUtility.timeOption(startDate, startTime, endDate)
        
        //expect(result).toEqual(expectedResult)
    })

    it('endTimeOption input[startDate(saturday), startTime, endDate(sunday)] #range should return [18,19,...,21,22,23]' , () =>{
        const expectedResult = ["10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00", "18:30", "19:00", "19:30", "20:00","20:30","21:00"]
        const startDate = dayjs("25 Jun 2022").toDate()
        const startTime = "10:30"
        const endDate = dayjs("26 Jun 2022").toDate()
        const result = BookingUtility.timeOption(startDate, startTime, endDate)
        
        //expect(result).toEqual(expectedResult)
    })

})
