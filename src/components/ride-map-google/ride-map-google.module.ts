import { NgModule } from "@angular/core";
import { RideMapGoogleComponent } from "./ride-map-google.component";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [CommonModule],
  declarations: [RideMapGoogleComponent],
  exports: [RideMapGoogleComponent],
  providers: []
})
export class RideMapGoogleModule { }
