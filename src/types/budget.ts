export type BudgetCategoryType = 'income' | 'expense';

export interface BudgetCategory {
  id: string;
  user_id: string;
  name: string;
  type: BudgetCategoryType;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetSubcategory {
  id: string;
  category_id: string;
  name: string;
  is_recurring: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetTransaction {
  id: string;
  user_id: string;
  subcategory_id: string;
  amount: number;
  month: number;
  year: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithSubcategories extends BudgetCategory {
  subcategories: BudgetSubcategory[];
}

export interface SubcategoryWithTransaction extends BudgetSubcategory {
  transaction?: BudgetTransaction;
}

export interface MonthlyBudgetSummary {
  income: number;
  expenses: number;
  balance: number;
}

// Legacy types for compatibility
export type ExpenseCategory = 'needs' | 'wants';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  isFixed?: boolean;
  isActual?: boolean;
  plannedMonth?: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  value: number;
  category: ExpenseCategory;
  recurrence: 'monthly' | number;
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