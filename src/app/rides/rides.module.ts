import { NgModule } from "@angular/core";
import { RidesComponent } from "./rides.component";
import { RidesGuard } from "./rides.guard";
import { RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  imports: [
    BrowserModule, 
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
