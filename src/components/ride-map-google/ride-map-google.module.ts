import { NgModule } from "@angular/core";
import { RideMapGoogleComponent } from "./ride-map-google.component";
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  declarations: [RideMapGoogleComponent],
  exports: [RideMapGoogleComponent],
  providers: []
})
export class RideMapGoogleModule { }
