import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RideComponent } from "./ride.component";
import { RideGuard } from "./ride.guard";
import { BrowserModule } from "@angular/platform-browser";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  imports: [BrowserModule, RouterModule, MatSnackBarModule, MatButtonModule],
  declarations: [RideComponent],
  providers: [RideGuard]
})
export class RideModule { }
