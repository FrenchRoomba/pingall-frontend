import {
  Auth,
  GithubAuthProvider,
  User,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { Component, OnDestroy, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'pingall-frontend';
}
