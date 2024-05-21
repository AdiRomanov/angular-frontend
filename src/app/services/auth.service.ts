import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

interface TokenInterface {
  user_id: number; // Define other properties based on your token's payload
  exp?: number;
 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

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
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  public getToken(): string | null{
    return localStorage.getItem('token');
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<TokenInterface>(token);
      return decoded.user_id; // Assuming 'user_id' is the name of the payload property containing the user ID
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationDate = decoded.exp * 1000; // Convert from seconds to milliseconds
    return Date.now() >= expirationDate;
  }
  
}


