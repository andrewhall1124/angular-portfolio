import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { PortfolioListComponent } from "./pages/portfolio-list/portfolio-list.component";
import { PortfolioComponent } from "./pages/portfolio/portfolio.component";

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'portfolios', component: PortfolioListComponent},
  { path: 'portfolios/:id', component: PortfolioComponent},
]