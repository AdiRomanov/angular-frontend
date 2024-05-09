import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const email = this.email.value || ''; // Fallback to empty string if null
      const password = this.password.value || ''; // Similarly for password

      this.authService.login(email, password).subscribe(success => {
        if (success) {
          this.router.navigate(['/dashboard']); // Navigate to home or dashboard page
        }
      });
    }
  }
}
