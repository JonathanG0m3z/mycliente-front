'use client'

export interface BotExecution {
    account: {
        email: string;
        service: {
            name: string;
        };
    };
    accountId: string;
    createdAt: Date;
    id: string;
    params: any | null;
    response: any | null;
    status: string;
    updatedAt: Date;
    userId: string;
    user: {
        name: string;
    }
}

export interface BotExecutionData {
    botExecutions: BotExecution[];
    total: number;
}
