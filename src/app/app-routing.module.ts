import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyIngredientsComponent } from './components/my-ingredients/my-ingredients.component';
import { AllRecipesComponent } from './components/all-recipes/all-recipes.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { RecipeMatchesComponent } from './components/recipe-matches/recipe-matches.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-ingredients',
        component: MyIngredientsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'all-recipes',
        component: AllRecipesComponent,
        canActivate: [AuthGuard]
      },
      { path: 'recipe-matches',
       component: RecipeMatchesComponent,
       canActivate: [AuthGuard]
      },
      
      { path: 'recipes/:id',
        component: RecipeDetailsComponent,
        canActivate: [AuthGuard]},
      {
        path: 'shopping-list',
        component: ShoppingListComponent,
        canActivate: [AuthGuard]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
