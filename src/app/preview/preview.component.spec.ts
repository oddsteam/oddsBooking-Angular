import { HttpClientTestingModule } from '@angular/common/http/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterModule } from '@angular/router'
import { PreviewComponent } from './preview.component'

describe('PreviewComponent', () => {
    let component: PreviewComponent
    let fixture: ComponentFixture<PreviewComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterModule.forRoot([])],
            declarations: [PreviewComponent],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(PreviewComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
