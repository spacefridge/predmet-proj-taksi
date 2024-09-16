import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private isAuthenticated = false;
    private userType: string | null = null;
  
    constructor(private router: Router) {}
  
    login(username: string, password: string): boolean {
      // Simulate backend authentication
      if (username === 'admin' && password === 'admin') {
        this.isAuthenticated = true;
        this.userType = 'admin';
        return true;
      } else if (username === 'user' && password === 'user') {
        this.isAuthenticated = true;
        this.userType = 'user';
        return true;
      }
      return false;
    }
  
    getUserType(): string | null {
      return this.userType;
    }
  
    isLoggedIn(): boolean {
      return this.isAuthenticated;
    }
  
    logout(): void {
      this.isAuthenticated = false;
      this.userType = null;
      this.router.navigate(['/login']);
    }
}