import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
