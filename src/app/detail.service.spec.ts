import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DetailService } from './detail.service';

describe('DetailService', () => {
  let service: DetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
