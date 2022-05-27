import { HttpClientTestingModule } from '@angular/common/http/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterModule } from '@angular/router'
import { DetailComponent } from './detail.component'

describe('DetailComponent', () => {
    let component: DetailComponent
    let fixture: ComponentFixture<DetailComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterModule.forRoot([])],
            declarations: [DetailComponent],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(DetailComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
