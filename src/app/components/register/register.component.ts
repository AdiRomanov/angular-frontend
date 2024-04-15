import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../shared/password-match.directive';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth';
import { MessageService } from 'primeng/api';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', Validators.required]
  },{
    validator: passwordMatchValidator

  }
)

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private messageService: MessageService,
      private router: Router
    ) {}

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  submitDetails() {
    const postData = { ...this.registerForm.value };
    delete postData.confirmPassword;

    this.authService.registerUser(postData as User).subscribe(
      response => {
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Register successfully' });
        this.router.navigate(['login']);
      }
      ,
      error => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });

      }
    )

  }
}
