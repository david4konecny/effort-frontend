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
  hidePassword = true;

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
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z]{3,15}')]],
      password: ['', [Validators.required, Validators.pattern('.{5,30}')]],
      addSampleData: [false]
    });
  }

  onSubmit() {
    const user = this.getUserFromForm();
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

  private getUserFromForm(): User {
    return {
      id: 0,
      username: this.form.value.username,
      password: this.form.value.password,
      addSampleData: this.form.value.addSampleData
    } as User;
  }

}
