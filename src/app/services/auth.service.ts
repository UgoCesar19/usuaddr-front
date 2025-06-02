// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Adjust path if needed

// Interface for what your backend sends on successful login/refresh
interface AuthResponse {
  tokenAcesso: string;
  refreshToken: string;
  // Add any other user details your backend returns, e.g., userId, username, roles
  // user: {
  //   id: number;
  //   username: string;
  //   roles: string[];
  // }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBasePath = environment.apiUrl;
  private TOKEN_KEY = 'tokenAcesso';
  private REFRESH_TOKEN_KEY = 'refreshToken';

  // --- Token Refresh State Management ---
  // Flag to indicate if a token refresh is currently in progress
  public isRefreshing = false;
  // Subject to communicate the new access token to waiting requests
  // Emits null initially, then the new token on success, or null again on refresh failure
  public refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // ------------------------------------

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Handles user login by sending credentials to the backend.
   * Stores access and refresh tokens on success.
   * @param credentials User's email and password.
   */
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBasePath}/autenticar`, credentials).pipe(
      tap(response => {
        this.setToken(response.tokenAcesso);
        this.setRefreshToken(response.refreshToken);
        // If your backend returns user info, you might store it here as well
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handles user registration.
   * @param userData User's registration details.
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiBasePath}/registro`, userData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves the access token from local storage.
   * @returns The access token string or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Retrieves the refresh token from local storage.
   * @returns The refresh token string or null if not found.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Stores the access token in local storage.
   * @param token The access token to store.
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Stores the refresh token in local storage.
   * @param token The refresh token to store.
   */
  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Removes both access and refresh tokens from local storage.
   */
  private removeTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Logs out the user by removing tokens and navigating to the login page.
   */
  logout(): void {
    this.removeTokens();
    this.router.navigateByUrl('/login');
  }

  /**
   * Checks if a user is currently authenticated (has an access token).
   * @returns True if an access token is present, false otherwise.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Checks if a user is currently logged in (has an access token).
   * This method is used by the AuthGuard to protect routes.
   * @returns True if an access token is present, false otherwise.
   */
  isLoggedIn(): boolean { // Renamed from isAuthenticated()
    return !!this.getToken();
  }

  /**
   * Attempts to refresh the access token using the stored refresh token.
   * If successful, updates the stored tokens. If failed, logs out the user.
   * @returns An Observable of the AuthResponse containing new tokens.
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      // If no refresh token, cannot refresh. Log out immediately.
      this.logout();
      return throwError(() => new Error('No refresh token available. Logging out.'));
    }

    // Call the backend's refresh token endpoint
    return this.http.post<AuthResponse>(`${this.apiBasePath}/atualizar-autenticacao`, { refreshToken }).pipe(
      tap(response => {
        // Store the new access token and potentially updated refresh token
        this.setToken(response.tokenAcesso);
        this.setRefreshToken(response.refreshToken); // Update refresh token if backend sends a new one
        // Emit the new access token to any waiting observers (e.g., interceptor)
        this.refreshTokenSubject.next(response.tokenAcesso);
      }),
      catchError(error => {
        // If refresh fails (e.g., refresh token expired/invalid), log out the user
        console.error('Failed to refresh token, logging out:', error);
        this.logout();
        // Propagate the error so the interceptor can handle it
        return throwError(() => error);
      })
    );
  }

  /**
   * Handles HTTP errors from authentication-related API calls.
   * @param error The HttpErrorResponse.
   * @returns An Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown authentication error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 401) {
        // Specific handling for login failure (e.g., "invalid credentials").
        // No auto-logout here, as this is typically from a login attempt, not an expired token.
        errorMessage = 'Invalid credentials. Please try again.';
      }
      // For other specific status codes (e.g., 403 Forbidden on registration if policy not met)
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}