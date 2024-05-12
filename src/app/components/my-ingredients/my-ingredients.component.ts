// my-ingredients.component.ts
import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../services/ingredient.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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
  userId: any;

  constructor(private ingredientService: IngredientService, private authService: AuthService) {
    this.userId = this.authService.getCurrentUserId(); // Assume AuthService can give you the current user's ID
  }

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
    this.ingredientService.getUserIngredients(this.userId).subscribe((data: any[]) => { // Explicitly type data as an array of any[]
     
    const ingredientObservables = data.map((item: { ingredient_id: number; }) => 
      this.ingredientService.getIngredientsById(item.ingredient_id));

    forkJoin(ingredientObservables).subscribe((results: any[]) => { // Explicitly type results as an array of any[]
     
      this.userIngredients = results; // Assuming results directly contain the ingredient details
    });
  });
  }

  addIngredient(ingredientId: number) {
    
    this.ingredientService.addUserIngredient(ingredientId).subscribe(() => {
      this.loadUserIngredients();
    });
  }

 

  removeIngredient(ingredientId: number) {
    this.ingredientService.deleteUserIngredient(ingredientId).subscribe({
      next: () => {
        // Remove the ingredient from userIngredients array immediately after successful deletion
        this.userIngredients = this.userIngredients.filter(ingredient => ingredient.id !== ingredientId);
      },
      error: (err) => {
        // Optionally handle errors, e.g., if the deletion didn't succeed
        console.error('Error removing ingredient:', err);
      }
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
