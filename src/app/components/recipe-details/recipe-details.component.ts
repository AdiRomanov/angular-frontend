import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';
import { IngredientService } from '../../services/ingredient.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;
  userIngredients: Set<number> = new Set();
  enrichedIngredients: any[] = []; // To hold the enriched details with marking
  shoppingList: Set<number> = new Set(); // To track ingredients in the shopping list
  isFetching = true;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private ingredientService: IngredientService,
    private authService: AuthService,
    private shoppingListService: ShoppingListService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    const userId = this.authService.getCurrentUserId() || 0;

    if (!userId) {
      console.error('User ID is not available');
      this.isFetching = false;
      return;
    }

    forkJoin({
      recipe: this.recipesService.getRecipeById(recipeId).pipe(
        catchError(error => {
          if (error.status === 404) {
            console.error('Recipe not found:', error);
            return of(null);
          } else {
            throw error;
          }
        })
      ),
      userIngredients: this.ingredientService.getUserIngredients(userId).pipe(
        catchError(error => {
          if (error.status === 404) {
            console.error('User ingredients not found:', error);
            return of([]);
          } else {
            throw error;
          }
        })
      ),
      shoppingList: this.shoppingListService.getShoppingList(userId).pipe(
        catchError(error => {
          if (error.status === 404) {
            console.error('Shopping list not found:', error);
            return of([]);
          } else {
            throw error;
          }
        })
      )
    }).subscribe({
      next: (results) => {
        this.recipe = results.recipe;
        this.userIngredients = new Set(results.userIngredients.map((item: { ingredient_id: number }) => item.ingredient_id));
        this.shoppingList = new Set(results.shoppingList.map((item: { ingredient_id: number }) => item.ingredient_id));
        this.enrichRecipeIngredients();
      },
      error: (error) => {
        console.error("Error loading initial data:", error);
        this.isFetching = false;
      }
    });
  }

  enrichRecipeIngredients() {
    if (this.recipe && this.recipe.ingredients) {
      const ingredientNames = this.recipe.ingredients.map((ingredientName: string) => ingredientName.toLowerCase());

      const userIngredientObservables = Array.from(this.userIngredients).map(id =>
        this.ingredientService.getIngredientsById(id).pipe(
          catchError(error => {
            console.error('Error fetching ingredient:', error);
            return of({ ingredient: 'Unknown', id }); // Fallback value in case of error
          })
        )
      );

      forkJoin(userIngredientObservables).subscribe(userIngredients => {
        const enrichedUserIngredients = userIngredients.map(({ ingredient, id }) => ({
          name: ingredient.toLowerCase(),
          id: id,
          hasIngredient: true,
          inShoppingList: this.shoppingList.has(id)
        }));

        const shoppingListObservables = Array.from(this.shoppingList).map(id =>
          this.ingredientService.getIngredientsById(id).pipe(
            catchError(error => {
              console.error('Error fetching ingredient:', error);
              return of({ ingredient: 'Unknown', id }); // Fallback value in case of error
            })
          )
        );

        forkJoin(shoppingListObservables).subscribe(shoppingListIngredients => {
          const enrichedShoppingListIngredients = shoppingListIngredients.map(({ ingredient, id }) => ({
            name: ingredient,
            id: id,
            hasIngredient: false,
            inShoppingList: true
          }));

          this.enrichedIngredients = [...enrichedUserIngredients, ...enrichedShoppingListIngredients];
          this.markRecipeIngredients();
          this.isFetching = false; // Set loading state to false
        });
      });
    }
  }

  markRecipeIngredients() {
    if (this.recipe && this.recipe.ingredients) {
      this.recipe.ingredients = this.recipe.ingredients.map((ingredientName: string) => {
        const normalizedIngredientName = ingredientName.toLowerCase();
        const found = this.enrichedIngredients.find(ing => ing.name === normalizedIngredientName);
        return {
          name: ingredientName,
          id: found ? found.id : null,
          hasIngredient: found ? found.hasIngredient : false,
          inShoppingList: found ? found.inShoppingList : false // Ensure null check for id
        };
      });
    }
  }

  addToShoppingList(ingredientName: string) {
    this.ingredientService.getIngredientByName(ingredientName).subscribe(ingredient => {
      this.shoppingListService.addToShoppingList(ingredient.id).subscribe(() => {
        this.shoppingList.add(ingredient.id); // Update shopping list locally
        this.enrichRecipeIngredients(); // Update display
      });
    });
  }
}
