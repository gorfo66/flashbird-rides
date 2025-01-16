import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login.component";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    BrowserModule, 
    RouterModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule,
    ReactiveFormsModule
    ],
  declarations: [LoginComponent],
  providers: []
})
export class LoginModule { }
