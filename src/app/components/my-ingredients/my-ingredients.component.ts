// my-ingredients.component.ts
import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../services/ingredient.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-ingredients',
  templateUrl: './my-ingredients.component.html',
  styleUrls: ['./my-ingredients.component.css']
})
export class MyIngredientsComponent implements OnInit {
  allIngredients: any[] = [];
  filteredIngredients: any[] = [];
  userIngredients: any[] = [];
  searchTerm: string = '';

  constructor(private ingredientService: IngredientService) {}

  ngOnInit() {
    this.loadIngredients();
    this.loadUserIngredients();
  }

  loadIngredients() { 
    this.ingredientService.getIngredients().subscribe(data => {
      this.allIngredients = data.sort((a: { ingredient: string; }, b: { ingredient: any; }) => a.ingredient.localeCompare(b.ingredient));
      this.filteredIngredients = this.allIngredients;
    });
  }

  loadUserIngredients() {
    this.ingredientService.getUserIngredients().subscribe(data => {
      this.userIngredients = data.sort((a: { ingredient: string; }, b: { ingredient: any; }) => a.ingredient.localeCompare(b.ingredient));
    });
  }

  addIngredient(ingredientId: number) {
    
    this.ingredientService.addUserIngredient(ingredientId).subscribe(() => {
      this.loadUserIngredients();
    });
  }

  removeIngredient(ingredientId: number) {
    this.ingredientService.deleteUserIngredient(ingredientId).subscribe(() => {
      this.loadUserIngredients();
    });
  }

  filterIngredients() {
    if (this.searchTerm) {
      this.filteredIngredients = this.allIngredients.filter(ing =>
        ing.ingredient.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredIngredients = this.allIngredients;
    }
  }
}
