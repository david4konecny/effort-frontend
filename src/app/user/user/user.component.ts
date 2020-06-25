import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  username = '';
  showUsernameForm = false;
  showPasswordForm = false;
  usernameForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
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

  onShowUsernameForm() {
    if (!this.showUsernameForm) {
      this.setupUsernameForm();
    }
    this.showUsernameForm = !this.showUsernameForm;
  }

  onShowPasswordForm() {
    if (!this.showPasswordForm) {
      this.setupPasswordForm();
    }
    this.showPasswordForm = !this.showPasswordForm;
  }

  setupUsernameForm() {
    this.usernameForm = this.formBuilder.group({
      newUsername: ['', Validators.required]
    });
  }

  setupPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  onSubmitUsernameChange() {
    const newUsername = this.usernameForm.value.newUsername;
    this.authService.editUsername(newUsername).subscribe(
      next => {
        this.snackBar.open('Username successfully changed', '', {duration: 2000});
        this.username = newUsername;
      },
      error => {
        this.snackBar.open('Username already exists', '', {duration: 2000});
      }
    );
  }

  onSubmitPasswordChange() {
    this.authService.editPassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword)
      .subscribe(next => {
        this.snackBar.open('Password successfully changed', '', {duration: 2000});
      },
      error => {
        this.snackBar.open('Error: Incorrect password', '', {duration: 2000});
      })
  }

  onDeleteAccount() {
    this.authService.deleteUser().subscribe(
      next => {
        this.snackBar.open('User account successfully deleted', '', {duration: 2000});
        this.router.navigate(['']);
      },
      error => {
        this.snackBar.open('Error: Could not delete the account', '', {duration: 2000});
      }
    )
  }

}
