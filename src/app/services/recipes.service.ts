// src/app/recipes.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private apiUrl = 'http://127.0.0.1:8000';  // Adjust the URL based on your actual API

  constructor(private http: HttpClient) { }

  getAllRecipes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes`);
  }

  getRecipeById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes/${id}`);
  }

  getRecipeMatches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recipes/recipe-matches/`);
  }

  
}
