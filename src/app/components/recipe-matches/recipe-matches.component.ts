// src/app/recipe-matches/recipe-matches.component.ts
import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../../services/recipes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-matches',
  templateUrl: './recipe-matches.component.html',
  styleUrls: ['./recipe-matches.component.css']
})
export class RecipeMatchesComponent implements OnInit {
  recipes: any[] = [];

  constructor(private recipesService: RecipesService, private router: Router) {}

  ngOnInit(): void {
    this.getRecipeMatches();
  }

  getRecipeMatches(): void {
    this.recipesService.getRecipeMatches()
      .subscribe(data => {
        this.recipes = data.recipes;
      }, error => {
        console.error('Failed to fetch recipes', error);
      });
  }

  navigateToRecipe(id: number): void {
    this.router.navigate(['/recipes', id]);  // Navigate to the recipe details page
  }
}
