// src/app/components/shopping-list/shopping-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ShoppingListService } from '../../services/shopping-list.service';
import { AuthService } from '../../services/auth.service';
import { IngredientService } from '../../services/ingredient.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  shoppingList: any[] = [];
  userId: any;
  

  constructor(private shoppingListService: ShoppingListService, private authService: AuthService, private ingredientService: IngredientService) {
    this.userId = this.authService.getCurrentUserId();
   }

  ngOnInit(): void {
    this.loadShoppingList();
  }

  loadShoppingList() {
    this.shoppingListService.getShoppingList(this.userId).subscribe(
      (data: any[]) => {
       
        const ingredientObservables = data.map((item: { ingredient_id: number; }) => 
          this.ingredientService.getIngredientsById(item.ingredient_id));
    
        forkJoin(ingredientObservables).subscribe((results: any[]) => { // Explicitly type results as an array of any[]
         
          this.shoppingList = results;
          
        });
      },
      error => {
        console.error('Error fetching shopping list:', error);
      }
    );
  }
  

  removeItem(itemId: number) {
    this.shoppingListService.removeFromShoppingList(itemId).subscribe({
      next: () => {
        this.shoppingList = this.shoppingList.filter(item => item.id !== itemId);
      },
      error: (err) => {
        console.error('Error removing item from shopping list:', err);
      }
   });
  }
}
