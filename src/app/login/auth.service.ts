import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { firebase } from '@firebase/app';
import '@firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}

  login() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  private AuthLogin(provider): Promise<any> {
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    return this.afAuth.signInWithPopup(provider);
  }

  logout() {
    this.afAuth.signOut();
  }

  getUserDetails() {
    return this.afAuth.currentUser;
  }
}
