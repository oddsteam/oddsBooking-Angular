import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredComponent } from './expired.component';

describe('ExpiredComponent', () => {
  let component: ExpiredComponent;
  let fixture: ComponentFixture<ExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
