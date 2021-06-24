import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const firebaseConfig = {
  apiKey: 'AIzaSyDfIQJLlp5-cBO-RaR8eMM1w2b56rxWjhs',
  authDomain: 'where-is-my-car-6a43b.firebaseapp.com',
  projectId: 'where-is-my-car-6a43b',
  storageBucket: 'where-is-my-car-6a43b.appspot.com',
  messagingSenderId: '545941893301',
  appId: '1:545941893301:web:7feaebcda6dc3b941e8efc',
  measurementId: 'G-4C3ERV5L60',
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
