import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PguDetailComponent } from './features/pgu-detail/pgu-detail.component';
import { SettingsComponent } from './features/settings/settings.component';

import { AuthGuard } from './_helpers';

const accountModule = () => import('./features/account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./features/users/users.module').then(x => x.UsersModule);
//const dashboardModule = () => import('./features/dashboard/dashboard.module').then(x => x.DashboardModule);

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'dashboard', component: DashboardComponent, },
    { path: 'void', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'pgu-detail/:id', component: PguDetailComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
