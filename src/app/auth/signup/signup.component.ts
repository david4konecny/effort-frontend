import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setupForm();
  }

  private setupForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    const user = { id: 0, username: this.form.value.username, password: this.form.value.password } as User;
    this.authService.signup(user).subscribe(
      next => {
        this.authService.login(user.username, user.password).subscribe(
          next => {
            this.router.navigate(['dashboard']);
          }
        );
      }
    );
  }

  onCancel() {
    this.router.navigate(['']);
  }

}
