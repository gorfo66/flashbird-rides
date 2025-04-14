import { NgModule } from "@angular/core";
import { RideMapGoogleComponent } from "./ride-map-google.component";
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  declarations: [RideMapGoogleComponent],
  exports: [RideMapGoogleComponent],
  providers: []
})
export class RideMapGoogleModule { }
