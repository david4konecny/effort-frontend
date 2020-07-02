import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username = '';
  userInitialLetter = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.setUserInfo();
  }

  onLogout() {
    this.authService.logout().subscribe(
      next => {
        this.snackBar.open('You have been logged out', '', {duration: 4000});
        this.router.navigate(['']);
      }
    )
  }

  private setUserInfo() {
    if (this.authService.username) {
      this.username = this.authService.username;
      this.userInitialLetter = this.getUpperCaseInitial(this.authService.username);
    } else {
      this.authService.getUsername().subscribe(
        next => {
          this.username = this.authService.username;
          this.userInitialLetter = this.getUpperCaseInitial(next)
        }
      );
    }
  }

  private getUpperCaseInitial(username: string) {
    return username.substring(0, 1).toUpperCase();
  }

}
