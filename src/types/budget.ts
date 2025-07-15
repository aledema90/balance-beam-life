export type ExpenseCategory = 'needs' | 'wants';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  isFixed?: boolean;
  isActual?: boolean; // true = actually happened, false/undefined = planned
  plannedMonth?: string; // for planned expenses, format: "YYYY-MM"
}

export interface FixedExpense {
  id: string;
  name: string;
  value: number;
  category: ExpenseCategory;
  recurrence: 'monthly' | number; // 'monthly' or custom days
}

export interface BudgetSettings {
  monthlyIncome: number;
  fixedExpenses: {
    mortgage: number;
    carPayment: number;
  };
  customFixedExpenses: FixedExpense[];
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
}