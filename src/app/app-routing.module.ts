import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BookingFormComponent } from './booking-form/booking-form.component'
import { DetailComponent } from './detail/detail.component'
import { ExpiredComponent } from './expired/expired.component'
import { PreviewComponent } from './preview/preview.component'
import { ThankPageComponent } from './thank-page/thank-page.component'

const routes: Routes = [
    { path: 'booking_detail', component: BookingFormComponent },
    { path: 'detail/:id', component: DetailComponent },
    { path: 'preview', component: PreviewComponent },
    { path: 'success', component: ThankPageComponent },
    { path: 'expired', component: ExpiredComponent },
    { path: '**', redirectTo: '/booking_detail', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
