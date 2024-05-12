// src/app/recipe-details/recipe-details.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from '../../services/recipes.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: any;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService
  ) { }

  ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id');
    this.recipesService.getRecipeById(recipeId).subscribe(data => {
      this.recipe = data;
    });
  }
}
