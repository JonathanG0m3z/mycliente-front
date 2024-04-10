'use client'

import { AccountData } from './Account'

export interface SharedBoard {
    createdAt: Date;
    deleted_at: null;
    id: string;
    name: string;
    updatedAt: Date;
    userId: string;
    users: any;
}
export interface SharedBoardData {
    boards: SharedBoard[];
    total: number;
}

export interface SharedBoardAccountsData extends AccountData {
    permissions?: string | string[]
}
