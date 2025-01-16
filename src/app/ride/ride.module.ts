import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RideComponent } from "./ride.component";
import { RideGuard } from "./ride.guard";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  imports: [BrowserModule, RouterModule],
  declarations: [RideComponent],
  providers: [RideGuard]
})
export class RideModule { }
