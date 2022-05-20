import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { DetailComponent } from './detail/detail.component';
import { PreviewComponent } from './preview/preview.component';
import { ThankPageComponent } from './thank-page/thank-page.component';

const routes: Routes = [
{path:'',redirectTo:'/booking_detail', pathMatch: 'full'},
{path : 'booking_detail', component: BookingFormComponent},
{path : 'detail/:id', component: DetailComponent},
{path : 'preview', component: PreviewComponent},
{path : 'thankyou', component: ThankPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }