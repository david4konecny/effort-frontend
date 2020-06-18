import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo() {
    if (this.authService.username) {
      this.username = this.authService.username;
    } else {
      this.authService.getUsername().subscribe(
        next => this.username = next
      );
    }
  }

}
