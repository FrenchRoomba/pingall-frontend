import { Auth, GithubAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);

  signIn() {
    const provider = new GithubAuthProvider();
    provider.addScope('read:org');
    signInWithPopup(this.auth, provider).then((result) => {
      this.router.navigate(['']);
    });
  }
}
