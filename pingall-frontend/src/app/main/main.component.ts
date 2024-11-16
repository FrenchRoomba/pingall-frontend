import {
  Auth,
  GithubAuthProvider,
  User,
  signInWithPopup,
  user,
} from '@angular/fire/auth';
import { Component, OnDestroy, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ResultsComponent } from '../results/results.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ResultsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  private auth: Auth = inject(Auth);

  signIn() {
    const provider = new GithubAuthProvider();
    provider.addScope('read:org');
    signInWithPopup(this.auth, provider);
  }
}
