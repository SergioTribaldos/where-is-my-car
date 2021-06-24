import { AuthService } from './../login/auth.service';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: firebase.default.User;
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {
    from(this.authService.getUserDetails()).subscribe((user) => {
      this.user = user;
    });
  }

  add() {
    if (!navigator.geolocation) {
      console.log('NO soportado');
      return;
    }

    navigator.geolocation.getCurrentPosition((val) => {
      const data = {
        latitude: val.coords.latitude,
        longitude: val.coords.longitude,
        date: firebase.default.firestore.Timestamp.now(),
        user: this.user.email,
      };
      this.firestore.collection('cars').add(data);
    });
  }

  nav() {
    this.router.navigate(['/home/car-map']);
  }
}
