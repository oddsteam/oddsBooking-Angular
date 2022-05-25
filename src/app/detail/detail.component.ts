import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BookingDetail } from '../booking'
import { DetailService } from '../detail.service'

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
    // ** ?  บอกว่าเป็น optional ว่าค่าอาจจะมีหรือไม่มี
    bookingDetail?: BookingDetail

    constructor(private detailService: DetailService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.onLoading()
    }

    onLoading() {
        try {
            const id = this.route.snapshot.paramMap.get('id')
            this.detailService.getBooking(id!).subscribe((data) => (this.bookingDetail = data))
        } catch (err) {
            console.log(err)
        }
    }

    onConfirm() {}
}
