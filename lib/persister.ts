"use client";

class MemoryStorage {
  private storage: Map<string, string> = new Map();
  setItem(key: string, value: string) {
    this.storage.set(key, value);
  }
  getItem(key: string) {
    return this.storage.get(key) ?? null;
  }

  removeItem(key: string) {
    this.storage.delete(key);
  }
  clear() {
    this.storage.clear();
  }
}

class Persister {
  private storage: Storage | MemoryStorage;
  private values: [string, string][] = [];

  constructor() {
    if (typeof window === "undefined") {
      this.storage = new MemoryStorage();
    } else {
      this.storage = window.localStorage;
    }
    this.hydrate();
  }

  hydrate() {
    const keys = Object.keys(this.storage);
    for (const key of keys) {
      const value = this.storage.getItem(key);
      if (value) {
        this.values.push([key, value]);
      }
    }
  }

  set(key: string, value: string) {
    const serializedValue = JSON.stringify(value);

    this.storage.setItem(key, serializedValue);
    this.values.push([key, serializedValue]);
  }

  get(key: string) {
    const value = this.storage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  remove(key: string) {
    this.storage.removeItem(key);
    this.values = this.values.filter(([k]) => k !== key);
  }

  clear() {
    this.storage.clear();
    this.values = [];
  }
}

const persister = new Persister();
export default persister;
