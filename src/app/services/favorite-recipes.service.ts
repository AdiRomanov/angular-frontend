// src/app/services/favorites.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment'; // Adjust the path as needed


@Injectable({
  providedIn: 'root'
})
export class FavoriteRecipesService {
  private apiUrl = environment.apiUrl; // Update with your API URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  addToFavorites(recipeId: number): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    return this.http.post(`${this.apiUrl}/favorite-recipes`, 
    {
      user_id: userId,
      recipe_id: recipeId
    });
  }

  removeFromFavorites(recipeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorite-recipes/${recipeId}`);
  }

  isFavorite(recipeId: any): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    return this.http.get(`${this.apiUrl}/favorite-recipes/${recipeId}/${userId}`);
  }

  getFavoriteRecipes(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/favorite-recipes/${id}`).pipe(
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
}
