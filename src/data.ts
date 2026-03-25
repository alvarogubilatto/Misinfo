import type { AppState } from './types';

export const STORAGE_KEY = 'voxu_v3';

export const defaultState: AppState = {
    balance: 42850,
    balanceHidden: false,
    darkMode: false,
    currentTab: 0,
    userName: 'Alex',
    subs: [
        { id: 1, icon: 'netflix', color: 'var(--cat-bg-red)', name: 'Netflix Premium', day: 15, price: 299, shared: true, paused: false, domain: 'netflix.com' },
        { id: 2, icon: 'spotify', color: 'var(--cat-bg-green)', name: 'Spotify Duo', day: 20, price: 179, paused: false, domain: 'spotify.com' },
        { id: 3, icon: 'amazon', color: 'var(--cat-bg-blue)', name: 'Amazon Prime', day: 28, price: 99, paused: false, domain: 'amazon.com' },
        { id: 4, icon: 'adobe', color: 'var(--cat-bg-purple)', name: 'Adobe CC', day: 1, price: 699, warning: 'Sube a $749 próx. mes', paused: false, domain: 'adobe.com' },
        { id: 5, icon: 'icloud', color: 'var(--cat-bg-cyan)', name: 'iCloud 200GB', day: 5, price: 39, paused: false, domain: 'apple.com' },
        { id: 6, icon: 'xbox', color: 'var(--cat-bg-yellow)', name: 'Xbox Game Pass', day: 12, price: 145, paused: false, domain: 'xbox.com' },
    ],
    activities: [
        { id: 1, icon: 'compras', bg: 'var(--text)', name: 'Apple Store', meta: 'Compras · Hoy, 2:45 PM', amount: -120, cat: 'compras', domain: 'apple.com' },
        { id: 2, icon: 'gasto', bg: 'var(--cat-bg-green)', name: 'Starbucks', meta: 'Alimentos · Hoy, 9:30 AM', amount: -5.40, cat: 'gasto', domain: 'starbucks.com' },
        { id: 3, icon: 'servicios', bg: 'var(--cat-bg-orange)', name: 'Factura de Luz', meta: 'Servicios · Ayer', amount: -145, cat: 'servicios', domain: 'edenor.com' },
        { id: 4, icon: 'ingreso', bg: 'var(--cat-green)', name: 'Depósito Sueldo', meta: 'Ingreso · Ayer', amount: 18500, cat: 'ingreso', domain: 'accenture.com' },
        { id: 5, icon: 'servicios', bg: 'var(--primary)', name: 'Plan Celular', meta: 'Servicios · Hace 2 días', amount: -40, cat: 'servicios', domain: 'movistar.com.ar' },
    ],
    accounts: [
        { id: 1, icon: 'bank', color: 'var(--cat-bg-blue)', name: 'Banco Galicia', num: '**** 4321', balance: 28400, domain: 'galicia.com.ar' },
        { id: 2, icon: 'card', color: 'var(--cat-bg-purple)', name: 'Banco Nación', num: '**** 8890', balance: 10200, domain: 'bna.com.ar' },
        { id: 3, icon: 'wallet', color: 'var(--cat-bg-green)', name: 'Efectivo', num: 'Billetera', balance: 4250, domain: 'mercadolibre.com.ar' },
    ],
    properties: [
        { id: 1, icon: 'home', gradient: 'var(--grad-secondary)', name: 'Casa Principal', address: 'Av. Corrientes 1234, CABA', value: 4200000, type: 'Propietario', hasWarning: false },
        { id: 2, icon: 'beach', gradient: 'var(--grad-primary)', name: 'Depto Playa', address: 'Mar del Plata, Buenos Aires', value: 2800000, type: 'Propietario', hasWarning: true },
    ],
    nextId: 100,
};

export function loadState(): AppState {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) { }
    return JSON.parse(JSON.stringify(defaultState));
}

export function saveStateToStorage(state: AppState): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { }
}

export function formatARS(n: number): string {
    return Math.floor(n).toLocaleString('es-AR');
}

export const formatMXN = formatARS;

export const chartData = {
    week: {
        data: [
            { in: 66, out: 50, li: '$18k', lo: '$11k' }, { in: 50, out: 62, li: '$14k', lo: '$13k' },
            { in: 83, out: 42, li: '$22k', lo: '$9k' }, { in: 55, out: 58, li: '$15k', lo: '$12k' },
            { in: 78, out: 38, li: '$20k', lo: '$8k' }, { in: 42, out: 52, li: '$12k', lo: '$11k' },
            { in: 30, out: 28, li: '$8k', lo: '$6k' }
        ],
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        subtitle: 'Semana actual'
    },
    month: {
        data: [
            { in: 72, out: 60, li: '$55k', lo: '$45k' }, { in: 55, out: 70, li: '$42k', lo: '$55k' },
            { in: 90, out: 45, li: '$68k', lo: '$35k' }, { in: 60, out: 55, li: '$45k', lo: '$42k' }
        ],
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        subtitle: 'Mes actual'
    },
    year: {
        data: [
            { in: 60, out: 50 }, { in: 70, out: 55 }, { in: 65, out: 60 }, { in: 80, out: 45 },
            { in: 55, out: 65 }, { in: 75, out: 48 }, { in: 85, out: 52 }, { in: 70, out: 60 },
            { in: 60, out: 45 }, { in: 90, out: 55 }, { in: 65, out: 70 }, { in: 78, out: 52 }
        ],
        labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        subtitle: 'Año 2025'
    }
};

export const reportData: Record<string, { total: string, slices: { v: number, c: string, label: string, val: string }[] }> = {
    '2025': { total: '$19.6k', slices: [{ v: 45, c: 'var(--primary)', label: 'Vivienda', val: '$8.8k' }, { v: 25, c: 'var(--cat-orange)', label: 'Impuestos', val: '$4.9k' }, { v: 20, c: 'var(--cat-green)', label: 'Servicios', val: '$3.9k' }, { v: 10, c: 'var(--primary-light)', label: 'Suscripciones', val: '$2.0k' }] },
    '2024': { total: '$17.2k', slices: [{ v: 40, c: 'var(--primary)', label: 'Vivienda', val: '$6.9k' }, { v: 28, c: 'var(--cat-orange)', label: 'Impuestos', val: '$4.8k' }, { v: 22, c: 'var(--cat-green)', label: 'Servicios', val: '$3.8k' }, { v: 10, c: 'var(--primary-light)', label: 'Suscripciones', val: '$1.7k' }] },
    '2023': { total: '$14.8k', slices: [{ v: 38, c: 'var(--primary)', label: 'Vivienda', val: '$5.6k' }, { v: 30, c: 'var(--cat-orange)', label: 'Impuestos', val: '$4.4k' }, { v: 20, c: 'var(--cat-green)', label: 'Servicios', val: '$3.0k' }, { v: 12, c: 'var(--primary-light)', label: 'Suscripciones', val: '$1.8k' }] },
};
