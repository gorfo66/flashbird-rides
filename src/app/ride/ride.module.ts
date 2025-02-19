import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RideComponent } from "./ride.component";
import { RideGuard } from "./ride.guard";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { RideMapGoogleModule, RideMapOsmModule } from "../../components";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatChipsModule,
    ReactiveFormsModule,
    RideMapOsmModule,
    RideMapGoogleModule
  ],
  declarations: [RideComponent],
  providers: [RideGuard]
})
export class RideModule { }
