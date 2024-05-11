// src/app/components/navigation/navigation.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token'); // Assuming the JWT token is stored in localStorage
    this.router.navigate(['/login']);
  }
}
