// src/app/recipe-details/recipe-details.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { IngredientService } from '../../services/ingredient.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;
  userIngredients: Set<number> = new Set();
  enrichedIngredients: any[] = []; // To hold the enriched details with marking



  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private ingredientService: IngredientService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadRecipeDetails();
    this.fetchIngredientDetails();
    
    
  }

  loadRecipeDetails() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    this.recipesService.getRecipeById(recipeId).subscribe(data => {
      this.recipe = data; 
    });
  }
  
  fetchIngredientDetails() {
    const userId = this.authService.getCurrentUserId() || 0; // Make sure 0 is handled as 'undefined' or similar in logic
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    this.ingredientService.getUserIngredients(userId).subscribe({
      next: (data) => {
        
        this.userIngredients = new Set(data.map((item: { ingredient_id: number }) => item.ingredient_id));
        this.fetchIngredientsById();
      },
      error: (error) => {
        console.error("Error fetching user ingredients:", error);
      }
    });
  }

  fetchIngredientsById() {
    if (this.userIngredients.size > 0) {
        const observables = Array.from(this.userIngredients).map(id =>
            this.ingredientService.getIngredientsById(id).pipe(
                catchError(error => {
                    console.error('Error fetching ingredient:', error);
                    return of({ ingredient: 'Unknown', id });  // Fallback value in case of error
                })
            )
        );

        forkJoin(observables).subscribe(results => {
            this.enrichedIngredients = results.map(({ ingredient, id }) => ({
                name: ingredient,
                id,
                hasIngredient: true  // Since these are from userIngredients, they are marked as had by user
            }));
            this.markRecipeIngredients();  // Call the function to mark recipe ingredients
        });
    }
}

  markRecipeIngredients() {
    if (this.recipe && this.recipe.ingredients && this.enrichedIngredients.length > 0) {
        this.recipe.ingredients = this.recipe.ingredients.map((ingredientName: any) => {
            const found = this.enrichedIngredients.find(ing => ing.name === ingredientName);
            return {
                name: ingredientName,
                hasIngredient: found ? true : false
            };
        });
    }
  }



  addToShoppingList(ingredientId: number) {
    this.ingredientService.addToShoppingList(ingredientId).subscribe(data => {
      
    });
  }

}
