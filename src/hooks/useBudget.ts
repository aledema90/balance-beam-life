import { useState, useEffect } from 'react';
import { Expense, BudgetSettings, MonthlyBudget, CategorySpending } from '@/types/budget';

const STORAGE_KEYS = {
  expenses: 'budget-tracker-expenses',
  settings: 'budget-tracker-settings'
};

const DEFAULT_SETTINGS: BudgetSettings = {
  monthlyIncome: 3000,
  fixedExpenses: {
    mortgage: 1200,
    carPayment: 237
  },
  customFixedExpenses: []
};

export const useBudget = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<BudgetSettings>(DEFAULT_SETTINGS);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEYS.expenses);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.settings);

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      // Initialize with fixed expenses for current month
      initializeFixedExpenses();
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  const initializeFixedExpenses = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const fixedExpenses: Expense[] = [
      {
        id: `mortgage-${currentMonth}`,
        date: `${currentMonth}-01`,
        amount: DEFAULT_SETTINGS.fixedExpenses.mortgage,
        category: 'needs',
        description: 'Mortgage Payment',
        isFixed: true,
        isActual: true
      },
      {
        id: `car-${currentMonth}`,
        date: `${currentMonth}-01`,
        amount: DEFAULT_SETTINGS.fixedExpenses.carPayment,
        category: 'needs',
        description: 'Car Payment',
        isFixed: true,
        isActual: true
      }
    ];
    setExpenses(fixedExpenses);
  };

  const getCurrentMonthExpenses = (): Expense[] => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenses.filter(expense => expense.date.startsWith(currentMonth));
  };

  const getMonthlyBudget = (): MonthlyBudget => {
    const totalIncome = settings.monthlyIncome;
    const needs = Math.floor(totalIncome * 0.5);
    const wants = Math.floor(totalIncome * 0.3);
    // Savings is calculated as the difference between income and needs+wants
    const savings = totalIncome - needs - wants;
    
    return {
      needs,
      wants,
      savings,
      total: totalIncome
    };
  };

  const getCategorySpending = (): CategorySpending => {
    const currentExpenses = getCurrentMonthExpenses();
    // Only count expenses that are marked as actual (happened)
    // Savings category is no longer interactive, so we only track needs and wants
    return currentExpenses
      .filter(expense => expense.isActual === true)
      .reduce(
        (acc, expense) => {
          acc[expense.category] += expense.amount;
          return acc;
        },
        { needs: 0, wants: 0 }
      );
  };

  const getPlannedSpending = (monthYear?: string): CategorySpending => {
    const targetMonth = monthYear || new Date().toISOString().slice(0, 7);
    const monthExpenses = expenses.filter(expense => 
      expense.date.startsWith(targetMonth) || expense.plannedMonth === targetMonth
    );
    
    return monthExpenses
      .filter(expense => expense.isActual !== true) // Only planned expenses
      .reduce(
        (acc, expense) => {
          acc[expense.category] += expense.amount;
          return acc;
        },
        { needs: 0, wants: 0 }
      );
  };

  const getAllExpensesByCategory = (category: string, monthYear?: string) => {
    const targetMonth = monthYear || new Date().toISOString().slice(0, 7);
    return expenses.filter(expense => 
      expense.category === category && 
      (expense.date.startsWith(targetMonth) || expense.plannedMonth === targetMonth)
    );
  };

  const getRemainingBudget = () => {
    const budget = getMonthlyBudget();
    const spending = getCategorySpending();
    // Calculate actual savings as what's left after needs and wants spending
    const actualSavings = budget.total - spending.needs - spending.wants;
    
    return {
      needs: budget.needs - spending.needs,
      wants: budget.wants - spending.wants,
      savings: actualSavings,
      total: actualSavings
    };
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateSettings = (newSettings: Partial<BudgetSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    expenses: getCurrentMonthExpenses(),
    settings,
    monthlyBudget: getMonthlyBudget(),
    categorySpending: getCategorySpending(),
    plannedSpending: getPlannedSpending(),
    remainingBudget: getRemainingBudget(),
    getAllExpensesByCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    updateSettings
  };
};