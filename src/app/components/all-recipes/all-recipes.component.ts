// src/app/all-recipes/all-recipes.component.ts

import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../../services/recipes.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.css']
})
export class AllRecipesComponent implements OnInit {
  recipes: any[] = [];
  searchTerm: string = '';
  filteredRecipes: any[] = [];

  constructor(private recipesService: RecipesService, private router: Router) { }

  ngOnInit(): void {
    this.recipesService.getAllRecipes().subscribe({
      next: (data) => {
        this.recipes = data.sort((a: any, b: any) => a.name.localeCompare(b.name)); // Sorting alphabetically by name
      },
      error: (error) => {
        console.error('There was an error retrieving recipes!', error);
      }
    });
  }


  filterRecipes(): void {
    if (!this.searchTerm) {
      this.filteredRecipes = []; // Clear the filtered recipes when search term is empty
    } else {
      this.filteredRecipes = this.recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }


  navigateToRecipe(id: number): void {
    this.router.navigate(['/recipes', id]);  // Navigate to the recipe details page
  }
}
