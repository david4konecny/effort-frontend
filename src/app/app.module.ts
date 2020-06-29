import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import { TasksComponent } from './tasks/tasks/tasks.component';
import { ReviewComponent } from './review/review/review.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TaskDialogComponent } from './tasks/task-dialog/task-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import { LogComponent } from './log/log.component';
import { TimeComponent } from './time/time/time.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TimePipe } from './time.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TimeDialogComponent } from './time/time-dialog/time-dialog.component';
import { TimeLogComponent } from './time/time-log/time-log.component';
import {MatTableModule} from '@angular/material/table';
import { StatsComponent } from './stats/stats/stats.component';
import { MonthStatsComponent } from './stats/month-stats/month-stats.component';
import { CategoryComponent } from './category/category/category.component';
import { CategoryDialogComponent } from './category/category-dialog/category-dialog.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { TodayComponent } from './today/today.component';
import { httpInterceptorProviders } from './interceptor-providers';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserComponent } from './user/user/user.component';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SignupComponent } from './auth/signup/signup.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { WeekStatsComponent } from './stats/week-stats/week-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TasksComponent,
    ReviewComponent,
    TaskDialogComponent,
    LogComponent,
    TimeComponent,
    TimePipe,
    TimeDialogComponent,
    TimeLogComponent,
    StatsComponent,
    MonthStatsComponent,
    CategoryComponent,
    CategoryDialogComponent,
    LoginComponent,
    HomeComponent,
    TodayComponent,
    UserComponent,
    SignupComponent,
    ConfirmationDialogComponent,
    WeekStatsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatTabsModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatTableModule,
        MatGridListModule,
        MatMenuModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        DragDropModule,
    ],
  entryComponents: [
    CategoryDialogComponent,
    ConfirmationDialogComponent,
    TaskDialogComponent,
    TimeDialogComponent
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
