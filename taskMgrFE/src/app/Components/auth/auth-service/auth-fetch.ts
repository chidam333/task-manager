import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CredentialsDTO, LoginResponse } from '../../../Models/auth.model';
import { UserDto, UserProfile } from '../../../Models/user.model';

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthFetch {
  async login(credentials: CredentialsDTO): Promise<LoginResponse | {error: string}> {
    await new Promise(resolve => setTimeout(() => {
      resolve(null);
    }, 1000));
    const response = await fetch(`${environment.apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {error: errorData || 'Login failed'};
    }
    const data: LoginResponse = await response.json();
    if (data.token) {
      this.storeToken(data.token);
    } else {
      return {error: 'Login failed: No token received'};
    }
    return data;
  }

  async register(userDto: UserDto): Promise<UserDto | {error:string}> {
    await new Promise(resolve => setTimeout(() => {
      resolve(null);
    }, 1000));
    const response = await fetch(`${environment.apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDto),
    });

    if (!response.ok) {
      const errorData = await response.text();
      if (response.status === 409) {
        return {error: 'User with this email already exists.'};
      }
      return {error: errorData || 'Registration failed'};
    }

    return await response.json();
  }

  async aboutMe(): Promise<UserProfile> {
    const token = this.getStoredToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${environment.apiUrl}/auth/aboutme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearStoredToken();
        throw new Error('Authentication token is invalid or expired');
      }
      const errorData = await response.text();
      throw new Error(errorData || 'Failed to fetch user profile');
    }

    return await response.json();
  }

  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }


  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }


  clearStoredToken(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log({payload})
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      this.clearStoredToken();
      return false;
    }
  }

  logout(): void {
    this.clearStoredToken();
  }

  getUserEmail(): string | {error:string} {
    const token = this.getStoredToken();
    if (!token) return {error: 'No token found'};

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || "";
    } catch (error) {
      return {error: error instanceof Error ? error.message : 'Unknown error occurred'};
    }
  }
  
  getUniqueName(): string | {error:string} {
    const token = this.getStoredToken();
    if (!token) return {error: 'No token found'};

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.unique_name || "";
    } catch (error) {
      return {error: error instanceof Error ? error.message : 'Unknown error occurred'};
    }
  } 
}
