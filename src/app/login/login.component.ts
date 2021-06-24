import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(public loginService: AuthService, private router: Router) {}

  ngOnInit() {}

  login() {
    this.loginService.login().then(() => {
      this.router.navigate(['/home']);
    });
  }
}
