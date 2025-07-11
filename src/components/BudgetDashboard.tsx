import { useBudget } from '@/hooks/useBudget';
import { YearlyForecast } from './YearlyForecast';
import { BudgetOverview } from './BudgetOverview';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { MonthlySummary } from './MonthlySummary';
import { SettingsModal } from './SettingsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Calendar } from 'lucide-react';

export const BudgetDashboard = () => {
  const {
    expenses,
    settings,
    monthlyBudget,
    categorySpending,
    plannedSpending,
    remainingBudget,
    getAllExpensesByCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    updateSettings
  } = useBudget();

  const getCurrentMonth = () => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Wallet className="w-8 h-8 text-primary" />
              Budget Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your 50/30/20 budget for {getCurrentMonth()}
            </p>
          </div>
          <div className="flex gap-2">
            <SettingsModal 
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="mb-8">
          <MonthlySummary 
            budget={monthlyBudget}
            spending={categorySpending}
            remainingBudget={remainingBudget}
          />
        </div>

        {/* Budget Overview */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" />
              Monthly Budget Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Your 50/30/20 budget breakdown and spending progress
            </p>
          </div>
          <BudgetOverview 
            budget={monthlyBudget}
            spending={categorySpending}
            plannedSpending={plannedSpending}
            getAllExpensesByCategory={getAllExpensesByCategory}
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            onDeleteExpense={deleteExpense}
          />
        </div>

        {/* Add Expense Form */}
        <div className="mb-8">
          <ExpenseForm onAddExpense={addExpense} />
        </div>

        {/* Yearly Forecast */}
        <div className="mb-8">
          <YearlyForecast 
            monthlyBudget={monthlyBudget}
            currentSpending={categorySpending}
          />
        </div>

        {/* Expense List */}
        <div className="mb-8">
          <ExpenseList 
            expenses={expenses}
            onDeleteExpense={deleteExpense}
            onEditExpense={updateExpense}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Following the 50/30/20 budgeting rule • Salary received on the 15th</p>
        </footer>
      </div>
    </div>
  );
};