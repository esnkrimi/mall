import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ExpState } from './+state/reducer';
import { storeEffects } from './+state/effect';
import { CoreModule } from './core/core.module';
import { MatDialogModule } from '@angular/material/dialog';
import {
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { rootRouteModule } from './app.routes';
import { MasterModule } from './master/master.module';
import { NgMagnizoomModule } from 'ng-magnizoom';
import { MatSliderModule } from '@angular/material/slider';
import { FilterComponent } from 'src/libs/widgets/filter/filter.component';
import { MatChipsModule } from '@angular/material/chips';
export function detectWidth() {
  return window.innerWidth > 1200;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    rootRouteModule,
    NgMagnizoomModule,
    HttpClientModule,
    MatChipsModule,
    MatSliderModule,
    FilterComponent,
    MasterModule,
    MatDialogModule,
    CoreModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ store: ExpState.reducer }),
    EffectsModule.forRoot([storeEffects]),
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '639634141754-kikes86omq7df989oe5firsuoapmafm7.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err: any) => {
       //   console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: 'deviceIsPc',
      useFactory: detectWidth,
    },
    {
      provide: 'BAASEURL',
      useValue: 'https://burjcrown.com/drm/exp/index.php',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
//e1c342997b157957a580bd1d52fad6ba
