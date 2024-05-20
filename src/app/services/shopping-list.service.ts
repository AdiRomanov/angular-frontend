// src/app/services/shopping-list.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private apiUrl = environment.apiUrl; // Adjust as necessary

  constructor(private http: HttpClient, private authService: AuthService) { }

  getShoppingList(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/shopping-list/${id}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.error('Shopping list not found:', error);
          return of([]); // Return an empty array if 404 error occurs
        } else {
          throw error;
        }
      })
    );
  }

  addToShoppingList(ingredientId: number): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    console.log('User ID:', userId);
    console.log('Ingredient ID:', ingredientId);
    return this.http.post(`${this.apiUrl}/shopping-list`, { 
       user_id: userId,
       ingredient_id: ingredientId 
      });
  }

  removeFromShoppingList(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/shopping-list/${itemId}`);
  }
}
