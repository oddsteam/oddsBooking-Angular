import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { BookingService } from './booking.service'

describe('BookingService', () => {
    let service: BookingService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })
        service = TestBed.inject(BookingService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })

    it('#isWeekend should return true from weekend date', () => {
        const result = BookingService.isWeekend(new Date())
        expect(result).toBe(false)
    })

    it('#isDisableEndDate startdate is empty', () => {
        const result = BookingService.isDisableEndDate(null, new Date(), new Date())
        expect(result).toBeTruthy()
    })


})
