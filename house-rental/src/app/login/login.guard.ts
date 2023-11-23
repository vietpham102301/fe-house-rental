import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const authority =localStorage.getItem("Authority")
    
    if (token) {
  
      const tokenExpiration = this.getTokenExpiration(token);
      
 
      if (tokenExpiration && tokenExpiration > Date.now()) {
        // Token is not expired, prevent access to login component
        if(authority ==="ADMIN"){
          this.router.navigate(['/dashboard']);
        }else if (authority==="MANAGER"){
          this.router.navigate(['/dashboard-manager']);
        }
        
        return false;
      }
    }
    
    // Token does not exist or is expired, allow access to login component
    return true;
  }
  
  private getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        return payload.exp * 1000; 
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return null;
  }

}
