import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ThankPageComponent } from './thank-page.component';

describe('ThankPageComponent', () => {
  let component: ThankPageComponent;
  let fixture: ComponentFixture<ThankPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [ ThankPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
