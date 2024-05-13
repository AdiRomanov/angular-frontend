// ingredient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getIngredients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ingredients`);
  }
  getIngredientsById(id: number): Observable<any> {

    return this.http.get(`${this.apiUrl}/ingredients/${id}`);
  }

  getUserIngredients(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-ingredients/${id}`);
  }

  addUserIngredient(ingredientId: number): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    
    return this.http.post(`${this.apiUrl}/user-ingredients`, {
      user_id: userId,
      ingredient_id: ingredientId
    });
  }

  addToShoppingList(ingredientId: number): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    return this.http.post(`${this.apiUrl}/shopping-list`, {
       user_id: userId,
       ingredientId: ingredientId });
  }

  deleteUserIngredient(ingredient_id: number): Observable<any> {
    
   return this.http.delete(`${this.apiUrl}/user-ingredients/${ingredient_id}`);
  }
}
