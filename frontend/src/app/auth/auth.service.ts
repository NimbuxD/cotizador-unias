import { Injectable } from '@angular/core';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

const CONSENT_KEY_PREFIX = 'cotizador_consent_v1_';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly firebaseApp =
    getApps().length === 0
      ? initializeApp(environment.firebase)
      : getApps()[0];

  private readonly auth = getAuth(this.firebaseApp);

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = new Promise((resolve) => {
      let resolved = false;
      onAuthStateChanged(this.auth, (user) => {
        this.userSubject.next(user);
        if (!resolved) {
          resolved = true;
          resolve();
        }
      });
    });
  }

  async waitForInit(): Promise<void> {
    return this.initPromise;
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.getIdToken() : null;
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  hasConsented(uid: string): boolean {
    return localStorage.getItem(`${CONSENT_KEY_PREFIX}${uid}`) === 'true';
  }

  saveConsent(uid: string): void {
    localStorage.setItem(`${CONSENT_KEY_PREFIX}${uid}`, 'true');
  }
}
