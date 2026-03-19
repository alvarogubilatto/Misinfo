export interface Subscription {
    id: number;
    icon: string;
    color: string;
    name: string;
    day: number;
    price: number;
    shared?: boolean;
    paused: boolean;
    warning?: string;
}

export interface Activity {
    id: number;
    icon: string;
    bg: string;
    name: string;
    meta: string;
    amount: number;
    cat: 'ingreso' | 'gasto' | 'servicios' | 'compras';
}

export interface Account {
    id: number;
    icon: string;
    color: string;
    name: string;
    num: string;
    balance: number;
}

export interface Property {
    id: number;
    icon: string;
    gradient: string;
    name: string;
    address: string;
    value: number;
    type: string;
    hasWarning: boolean;
}

export interface AppState {
    balance: number;
    balanceHidden: boolean;
    darkMode: boolean;
    currentTab: number;
    userName: string;
    avatarUrl?: string;
    subs: Subscription[];
    activities: Activity[];
    accounts: Account[];
    properties: Property[];
    nextId: number;
    toast?: {
        msg: string;
        show: boolean;
        type: string;
    };
    feedback?: {
        show: boolean;
        text: string;
        sub?: string;
        type: 'success' | 'error';
    };
}
