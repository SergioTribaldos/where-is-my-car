import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import * as firebase from 'firebase';
import {
  BehaviorSubject,
  from,
  Observable,
  Subject,
  throwError,
  timer,
} from 'rxjs';
import {
  delay,
  delayWhen,
  map,
  repeat,
  retry,
  retryWhen,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { AuthService } from '../login/auth.service';
import { ToastController } from '@ionic/angular';

const icon = {
  icon: L.icon({
    iconAnchor: [13, 0],
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png',
  }),
};

type Mode = 'where' | 'park';

@Component({
  selector: 'app-car-map',
  templateUrl: './car-map.component.html',
  styleUrls: ['./car-map.component.scss'],
})
export class CarMapComponent implements OnInit {
  title: string;
  mode: Mode;
  parkDate: any;
  dateLoading = true;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private map;
  private user;
  private currentLocationMarker: any;
  private currentCoords: { latitude: string; longitude: string };

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private authService: AuthService,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.route.params.subscribe(({ action }) => {
      action === 'where' ? this.initWhereIsMyCarMap() : this.initParkMyCarMap();
      this.mode = action === 'where' ? 'where' : 'park';
    });

    from(this.authService.getUserDetails()).subscribe((user) => {
      this.user = user;
    });
  }

  parkCar() {
    const data = {
      latitude: this.currentCoords.latitude,
      longitude: this.currentCoords.longitude,
      date: firebase.default.firestore.Timestamp.now(),
      user: this.user.email,
    };
    this.firestore
      .collection('cars')
      .add(data)
      .then(async () => {
        const toast = await this.toastController.create({
          message: 'Aparcado!',
          color: 'success',
          duration: 2000,
        });
        toast.present();
      });
  }

  private initMap({ latitude, longitude }): void {
    this.map = L.map('map', {
      center: [latitude, longitude],
      zoom: 18,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        minZoom: 4,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    this.currentLocationMarker = L.marker(
      { lat: latitude, lng: longitude },
      icon
    ).addTo(this.map);
  }

  private initWhereIsMyCarMap() {
    this.title = '¿Donde esta mi coche?';
    from(this.authService.getUserDetails())
      .pipe(
        take(1),
        tap(() => this.loading$.next(false)),
        switchMap((user) =>
          this.firestore
            .collection('cars', (list) =>
              list.where('user', '==', user.email).orderBy('date', 'desc')
            )
            .get()
        ),
        map((data) => data.docs.map((doc) => doc.data()))
      )
      .subscribe((data) => {
        const [firstMatch] = data;
        this.parkDate = firstMatch['date'];
        this.dateLoading = false;

        this.currentCoords = {
          latitude: firstMatch['latitude'],
          longitude: firstMatch['longitude'],
        };
        this.initMap(this.currentCoords);
      });
  }

  private initParkMyCarMap() {
    this.title = 'Aparcar';
    const options: PositionOptions = {
      enableHighAccuracy: true,
    };

    const geoLocation$ = new Observable((subscriber) => {
      const geoId = navigator.geolocation.watchPosition(
        (geoLocation) => {
          console.log(geoLocation);
          if (geoLocation.coords.accuracy < 50) {
            navigator.geolocation.clearWatch(geoId);
            this.loading$.next(false);
            subscriber.next(geoLocation);
            subscriber.complete();
          }
        },
        () => {},
        options
      );
    });

    geoLocation$.pipe(take(1), delay(400)).subscribe(({ coords }) => {
      this.currentCoords = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      this.initMap(this.currentCoords);

      this.map.on('click', (e) => {
        this.currentCoords = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        };
        this.map.removeLayer(this.currentLocationMarker);
        this.currentLocationMarker = L.marker(e.latlng, icon).addTo(this.map);
      });
    });
  }
}
