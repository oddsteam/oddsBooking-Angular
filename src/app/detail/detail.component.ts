import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import * as dayjs from 'dayjs'
import { BookingRes } from '../booking'
import { DetailService } from '../detail.service'
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component'
import { DialogSpinnerComponent } from '../dialog-spinner/dialog-spinner.component'

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css', '../app.component.css'],
})
export class DetailComponent implements OnInit {
    // ** ?  บอกว่าเป็น optional ว่าค่าอาจจะมีหรือไม่มี
    bookingDetailRes?: BookingRes
    start_date: string = ""
    end_date: string = ""

    constructor(
        private detailService: DetailService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.onLoading()
    }

    onLoading() {
        try {
            const id = this.route.snapshot.paramMap.get('id')
            this.detailService.getBooking(id!).subscribe(
                (res) => {
                    const startDate = dayjs(res.data.startDate).format(
                        'YYYY-MM-DDTHH:mm'
                    )
                    const endDate = dayjs(res.data.endDate).format(
                        'YYYY-MM-DDTHH:mm'
                    )
                    res.data.startDate = startDate
                    res.data.endDate = endDate
                    this.bookingDetailRes = res
                    console.log(res)
                    this.start_date = dayjs(res.data.startDate).format('YYYY-MM-DD HH:mm')
                    this.end_date = dayjs(res.data.endDate).format('YYYY-MM-DD HH:mm')
                },
                (err) => this.router.navigateByUrl('expired')
            )
        } catch (error) {}
    }

    async onConfirm() {
        this.bookingDetailRes!.data.status = true
        this.dialog.open(DialogSpinnerComponent, {
            disableClose: true,
            data: { msg: 'Please Wait...' },
        })

        await this.detailService.confirmBooking(this.bookingDetailRes!).subscribe((response) => {
            this.dialog.closeAll()
            this.dialog.open(DialogConfirmComponent)
        })
    }
}
