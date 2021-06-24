import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarMapRoutingModule } from './car-map-routing.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CarMapComponent } from './car-map.component';

@NgModule({
  declarations: [CarMapComponent],
  imports: [CommonModule, FormsModule, IonicModule, CarMapRoutingModule],
})
export class CarMapModule {}
