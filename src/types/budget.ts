export type ExpenseCategory = 'needs' | 'wants' | 'savings';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  isFixed?: boolean;
}

export interface BudgetSettings {
  monthlyIncome: number;
  fixedExpenses: {
    mortgage: number;
    carPayment: number;
  };
}

export interface MonthlyBudget {
  needs: number;
  wants: number;
  savings: number;
  total: number;
}

export interface CategorySpending {
  needs: number;
  wants: number;
  savings: number;
}