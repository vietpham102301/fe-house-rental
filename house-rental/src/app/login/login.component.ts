import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {

  }
  login() {
    this.authService.Authenticate(this.username, this.password).subscribe(
      (result) => {
        console.log(result);
        if (result) {
          if(result.status === 401){
            this.errorMessage = result.error.message;
          }
          if(result.status === 400){
            this.errorMessage = result.error.message;
          }

          console.log(this.authService.getAuthority());
          if (this.authService.getAuthority() === "ADMIN") {
            this.router.navigate(["/dashboard"]);
          } else if (this.authService.getAuthority() === "MANAGER") {
            this.router.navigate(["/dashboard-manager"]);
          }
          
        } else {
          this.router.navigate(["/login"]);
          
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  ngOnInit(): void {

  }
}
