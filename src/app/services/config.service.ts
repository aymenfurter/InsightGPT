import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly STORAGE_KEY_PREFIX = 'config-';

  private getKey(key: string): string {
    return `${this.STORAGE_KEY_PREFIX}${key}`;
  }

  private getValue<T>(key: string, defaultValue: T): T {
    const storedValue = localStorage.getItem(this.getKey(key));
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  }

  private setValue(key: string, value: any): void {
    localStorage.setItem(this.getKey(key), JSON.stringify(value));
  }

  getStandardEntitiesEnabled(): boolean {
    return this.getValue('standardEntitiesEnabled', true);
  }

  setStandardEntitiesEnabled(value: boolean): void {
    this.setValue('standardEntitiesEnabled', value);
  }

  getCustomEntitiesList(): string {
    return this.getValue('customEntitiesList', '');
  }

  setCustomEntitiesList(value: string): void {
    this.setValue('customEntitiesList', value);
  }

  getOpenAIToken(): string {
    return this.getValue('openAIToken', '');
  }

  setOpenAIToken(value: string): void {
    this.setValue('openAIToken', value);
  }

  getEndpointUrl(): string {
    return this.getValue('endpointUrl', '');
  }

  setEndpointUrl(value: string): void {
    this.setValue('endpointUrl', value);
  }

  getModelName(): string {
    return this.getValue('modelName', '');
  }

  setModelName(value: string): void {
    this.setValue('modelName', value);
  }
  
  getAmountOfEntities(): string {
    // set default amountOfEntities to 10 if no value is provided
    if (this.getValue('amountOfEntities', '') === '') {
      this.setValue('amountOfEntities', 10);
    }
    return this.getValue('amountOfEntities', '');
  }

  setAmountOfEntities(value: string): void {
    this.setValue('amountOfEntities', value);
  }
}
