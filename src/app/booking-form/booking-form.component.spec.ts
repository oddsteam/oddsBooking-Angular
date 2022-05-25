import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterModule } from '@angular/router'
import { BookingFormComponent } from './booking-form.component'

describe('BookingFormComponent', () => {
    let component: BookingFormComponent
    let fixture: ComponentFixture<BookingFormComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterModule.forRoot([])],
            declarations: [BookingFormComponent],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(BookingFormComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
