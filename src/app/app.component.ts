import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userName: string = null;
  flightCount: number;

  get accessToken() {
    return this.oauthService.getAccessToken();
  }

  get refreshToken() {
    return this.oauthService.getRefreshToken();
  }

  get idToken() {
    return this.oauthService.getIdToken();
  }

  constructor(
    private http: HttpClient,
    private oauthService: OAuthService) {

    oauthService.configure(authConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
      const claims = this.oauthService.getIdentityClaims();
      if (!claims) {
        return null;
      }
      this.userName = claims['given_name'];
      this.queryApi();
    });
  }

  queryApi() {
    const url = 'https://www.angular.at/api/flight';
    this.http.get<unknown[]>(url).subscribe({
      next: flights => this.flightCount = flights.length,
      error: err => console.error('err', err)
    });
  }

  login(): void {
    this.oauthService.initLoginFlow();
  }

  refresh(): void {
    this.oauthService.refreshToken();
  }

  logout(): void {
    this.oauthService.logOut();
  }
}
