import { NgModule } from "@angular/core";
import { RideMapOsmComponent } from "./ride-map-osm.component";
import { CommonModule } from "@angular/common";


@NgModule({
  imports: [CommonModule],
  declarations: [RideMapOsmComponent],
  exports: [RideMapOsmComponent],
  providers: []
})
export class RideMapOsmModule { }
