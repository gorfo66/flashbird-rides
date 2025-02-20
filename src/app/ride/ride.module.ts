import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RideComponent } from "./ride.component";
import { RideGuard } from "./ride.guard";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { RideMapGoogleModule, RideMapOsmModule, StatisticTileModule } from "../../components";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    ReactiveFormsModule,
    RideMapOsmModule,
    RideMapGoogleModule,
    StatisticTileModule
  ],
  declarations: [RideComponent],
  providers: [RideGuard]
})
export class RideModule { }
