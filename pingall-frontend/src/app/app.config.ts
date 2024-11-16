import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'pingall',
          appId: '1:339379565744:web:a3f9f9db7a3b0756eab775',
          storageBucket: 'pingall.appspot.com',
          apiKey: 'AIzaSyBlVLrc6F9b9PTQ40fHDGmvFq11n08fTOU',
          authDomain: 'pingall.firebaseapp.com',
          messagingSenderId: '339379565744',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())), provideAnimationsAsync(),
  ],
};
