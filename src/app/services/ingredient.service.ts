// ingredient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = environment.apiUrl;

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

  getIngredientByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ingredients/ingredient-by-name/${name}`);
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
