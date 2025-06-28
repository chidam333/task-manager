import { Routes } from '@angular/router';
import { Auth } from './Components/auth/auth';
import { HomePage } from './Components/home-page/home-page';
import { authGuard } from './auth-guard';
import { DashboardPage } from './Components/dashboard-page/dashboard-page';
import { HistoryPage } from './Components/history-page/history-page';

export const routes: Routes = [
    { path: 'auth', component: Auth },
    { path: '', component: HomePage, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
    { path: "history/:id", component: HistoryPage, canActivate: [authGuard] }
];
