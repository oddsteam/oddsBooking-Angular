import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { BookingDetailRes } from '../booking'
import { DetailService } from '../detail.service'

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css', '../app.component.css'],
})
export class DetailComponent implements OnInit {
    // ** ?  บอกว่าเป็น optional ว่าค่าอาจจะมีหรือไม่มี
    bookingDetailRes?: BookingDetailRes

    constructor(private detailService: DetailService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.onLoading()
    }

    onLoading() {
        
        
        try {
            console.log("err");
            const id = this.route.snapshot.paramMap.get('id')
            this.detailService.getBooking(id!).subscribe(
                res => this.bookingDetailRes = res,
                err => this.router.navigateByUrl('expired')
            )
            
        } catch (error) {
            
        }
    }

    onConfirm() {
        this.bookingDetailRes!.status = true;
        this.detailService.confirmBooking(this.bookingDetailRes!).subscribe((response) => {})
    }
}
