import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogComponent } from './log/log.component';
import { StatsComponent } from './stats/stats/stats.component';
import { HomeComponent } from './home/home.component';
import { TodayComponent } from './today/today.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { UserComponent } from './user/user/user.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: '', children: [
          { path: '', component: TodayComponent },
          { path: 'stats', component: StatsComponent },
          { path: 'log', component: LogComponent },
          { path: 'account', component: UserComponent },
        ]}
    ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
