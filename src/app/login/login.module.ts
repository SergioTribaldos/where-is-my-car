import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
})
export class LoginModule {}
