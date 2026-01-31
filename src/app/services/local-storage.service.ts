import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly TOKEN_KEY = 'mayuwasi-reservas';

  constructor() { }

  // Guardar un valor en localStorage
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener un valor de localStorage
  get(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  // Eliminar un valor de localStorage
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Guardar el token en localStorage
  setToken(token: string): void {
    this.set(this.TOKEN_KEY, token);
  }

  // Obtener el token de localStorage
  getToken(): string {
    return this.get(this.TOKEN_KEY);
  }

  // Eliminar el token de localStorage
  removeToken(): void {
    this.remove(this.TOKEN_KEY);
  }
}

