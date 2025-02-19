import { NgModule } from "@angular/core";
import { RidesComponent } from "./rides.component";
import { RidesGuard } from "./rides.guard";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    ReactiveFormsModule
  ],
  declarations: [RidesComponent],
  providers: [RidesGuard]
})
export class RidesModule { }
