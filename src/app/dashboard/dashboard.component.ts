import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username = '';
  userInitialLetter = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setUserInfo();
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
