import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterModule } from '@angular/router'
import { BookingFormComponent } from './booking-form.component'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'
describe('BookingFormComponent', () => {
    let component: BookingFormComponent
    let fixture: ComponentFixture<BookingFormComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule, 
                RouterModule.forRoot([]),
                MatButtonModule,
                MatFormFieldModule,
                MatInputModule,
                MatSelectModule,
                MatCardModule,
                MatIconModule,
                NzDatePickerModule,
                NzFormModule,
                NzTimePickerModule,
                BrowserAnimationsModule,
                ReactiveFormsModule
            ],
            declarations: [BookingFormComponent],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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
