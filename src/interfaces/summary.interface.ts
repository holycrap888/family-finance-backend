export interface ISummary {
    month: string | undefined;
    salary: number;
    totalBalance: number;
    budgetRatio: {
        [k: string]: string;
    };
    recommended: {
        [k: string]: number;
    };
    actual: {
        totalSpent: number;
        byCategory: any;
    };
}