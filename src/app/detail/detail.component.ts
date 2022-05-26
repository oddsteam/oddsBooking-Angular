import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BookingDetail, BookingDetailRes } from '../booking'
import { DetailService } from '../detail.service'

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css', '../app.component.css'],
})
export class DetailComponent implements OnInit {
    // ** ?  บอกว่าเป็น optional ว่าค่าอาจจะมีหรือไม่มี
    bookingDetailRes?: BookingDetailRes

    constructor(private detailService: DetailService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.onLoading()
    }

    onLoading() {
        try {
            const id = this.route.snapshot.paramMap.get('id')
            this.detailService.getBooking(id!).subscribe((data) => (this.bookingDetailRes = data))
            console.log(this.bookingDetailRes);
        } catch (err) {
            console.log(err)
        }
    }

    onConfirm() {
        this.bookingDetailRes!.status = true;
        this.detailService.confirmBooking(this.bookingDetailRes!).subscribe((response) => {console.log(this.bookingDetailRes)})
    }
}
