import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { BookingDetail } from '../booking'
import { BookingService } from '../booking.service'

import { MatDialog } from '@angular/material/dialog';
import { DialogSpinnerComponent } from '../dialog-spinner/dialog-spinner.component'
import * as dayjs from 'dayjs'


@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.css', '../app.component.css'],
})
export class PreviewComponent implements OnInit {
    bookingDetail!: BookingDetail
    isConfirm: boolean = false
    start_date: string = ""
    end_date: string = ""

    constructor(
        private bookingService: BookingService,
        private location: Location,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.onLoading()
    }

    onLoading() {
        const serviceData = this.bookingService.getCurrentBooking()
        if (!serviceData) this.router.navigateByUrl('')
        this.bookingDetail = this.bookingService.getCurrentBooking()!
        this.start_date = dayjs(this.bookingDetail.startDate).format('YYYY-MM-DD HH:mm')
        this.end_date = dayjs(this.bookingDetail.endDate).format('YYYY-MM-DD HH:mm')
    }

    onReturn() {
        if (this.isConfirm) {
            this.bookingService.clearCurrentBooking()
        }
        this.location.back()
    }

    async onConfirm() {
        this.dialog.open(DialogSpinnerComponent, { disableClose: true , data: {msg : "Sending Email..."}})
        await this.bookingService.addBooking(this.bookingDetail).subscribe((data) => {
            this.dialog.closeAll()
            this.isConfirm = true
            this.bookingService.clearCurrentBooking()
            this.router.navigateByUrl('success')
        })
    }
}
