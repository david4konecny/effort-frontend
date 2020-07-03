import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';

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
  hideOldPassword = true;
  hideNewPassword = true;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
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
      newUsername: ['', [Validators.required, Validators.pattern('[a-zA-Z]{3,15}')]]
    });
  }

  setupPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern('.{5,30}')]],
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
    const dialogRef = this.openConfirmationDialog();
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.deleteAccount();
        }
      }
    );
  }

  private openConfirmationDialog() {
    return this.dialog.open(ConfirmationDialogComponent,
      { height: '200px', width: '400px',
        data: {
          title: 'Delete account?',
          content: 'This will delete all your data.'
        }
      }
    );
  }

  private deleteAccount() {
    this.authService.deleteUser().subscribe(
      next => {
        this.snackBar.open('User account successfully deleted', '', {duration: 4000});
        this.router.navigate(['']);
      },
      error => {
        this.snackBar.open('Error: Could not delete the account', '', {duration: 2000});
      }
    )
  }

  onLogout() {
    this.authService.logout().subscribe(
      next => {
        this.snackBar.open('You have been logged out', '', {duration: 4000});
        this.router.navigate(['']);
      }
    )
  }

}
