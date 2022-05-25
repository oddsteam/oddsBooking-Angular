import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-thank-page',
    templateUrl: './thank-page.component.html',
    styleUrls: ['./thank-page.component.css', '../app.component.css'],
})
export class ThankPageComponent implements OnInit {
    constructor(private router: Router) {}

    onReturn() {
        this.router.navigateByUrl('booking_detail')
    }

    ngOnInit(): void {}
}
