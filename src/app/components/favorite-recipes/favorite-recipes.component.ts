import { Component, OnInit } from '@angular/core';
import { FavoriteRecipesService } from '../../services/favorite-recipes.service';
import { AuthService } from '../../services/auth.service';
import { RecipesService } from '../../services/recipes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.css']
})
export class FavoriteRecipesComponent implements OnInit {

  favoriteRecipesData: any[] = [];
  favoriteRecipes: any[] = [];
  visibleRecipes: any[] = [];
  recipesPerPage = 3;
  currentPage = 1;
  totalPages = 0;

  constructor(
    private favoriteRecipesService: FavoriteRecipesService, 
    private authService: AuthService, 
    private recipeService: RecipesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    this.favoriteRecipesService.getFavoriteRecipes(userId).subscribe((recipes: any[]) => {
      this.favoriteRecipesData = recipes;
      let loadedRecipes = 0;

      for (const recipe of this.favoriteRecipesData) {
        this.recipeService.getRecipeById(recipe.recipe_id).subscribe((data: any) => {
          this.favoriteRecipes.push(data);
          loadedRecipes++;
          if (loadedRecipes === this.favoriteRecipesData.length) {
            this.totalPages = Math.ceil(this.favoriteRecipes.length / this.recipesPerPage);
            this.updateVisibleRecipes();
          }
        });
      }
    });
  }

  updateVisibleRecipes() {
    const startIndex = (this.currentPage - 1) * this.recipesPerPage;
    const endIndex = startIndex + this.recipesPerPage;
    this.visibleRecipes = this.favoriteRecipes.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisibleRecipes();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateVisibleRecipes();
    }
  }

  navigateToRecipe(id: number): void {
    this.router.navigate(['/recipes', id]);  // Navigate to the recipe details page
  }
}
