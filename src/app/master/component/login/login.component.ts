import {
  GoogleLoginProvider,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private socialAuthService: SocialAuthService,
    private store: Store,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.selectGoogleAuth();
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  selectGoogleAuth() {
    this.socialAuthService.authState.subscribe((user) => {
      this.store.dispatch(actions.login({ user: user }));
      setTimeout(() => {
        this.router.navigate(['']);
      }, 1000);
    });
  }
}
