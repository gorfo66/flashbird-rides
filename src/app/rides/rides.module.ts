import { NgModule } from "@angular/core";
import { RidesComponent } from "./rides.component";
import { RidesGuard } from "./rides.guard";
import { RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  imports: [BrowserModule, RouterModule, MatButtonModule, MatCardModule],
  declarations: [RidesComponent],
  providers: [RidesGuard]
})
export class RidesModule { }
