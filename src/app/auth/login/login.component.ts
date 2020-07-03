import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  displayForm = false;
  form: FormGroup;
  message = '';
  showLoadingSpinner = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.verifyAuthentication().subscribe(
      next => this.router.navigate([this.authService.targetUrl]),
      error => {
        this.displayForm = true;
        this.setUpForm();
      }
    );
  }

  private setUpForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showLoadingSpinner = true;
    this.authService.login(this.form.value.username, this.form.value.password).subscribe(
      next => {
        this.router.navigate([this.authService.targetUrl]);
      },
      error => {
        this.message = 'Username or password was not recognised. Please try again.';
        this.showLoadingSpinner = false;
      }
    );
  }

  onCancel() {
    this.router.navigate(['']);
  }

  onCloseMessage() {
    this.message = '';
  }

}
