'use client';
class Persister {
    private storage: Storage;
    private values: [string, string][] = [];

    constructor() {
        if (typeof window === 'undefined') {
            throw new Error('Persister is only available in a browser environment');
        }
        this.storage = window.localStorage;
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