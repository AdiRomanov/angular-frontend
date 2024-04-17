import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  registerUser(UserDetails: User){
    return this.http.post(`${this.baseUrl}/users`, UserDetails);
  }

  login(email: string, password: string): Observable<AuthResponse | null> {
    const formData: FormData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, formData)
      .pipe(
        tap((response: AuthResponse) => this.setSession(response)),
        catchError(error => {
          console.error('Login error:', error);
          return of(null); // Properly handle error
        })
      );
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.access_token); // Store the token in localStorage
  }

  logout() {
    localStorage.removeItem('token'); // Remove the token from localStorage
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('token') != null;
  }

  public getToken(): string | null{
    return localStorage.getItem('token');
  }

}
