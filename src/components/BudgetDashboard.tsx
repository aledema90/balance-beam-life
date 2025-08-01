import { useState } from 'react';
import { useBudget } from '@/hooks/useBudget';
import { useAuth } from '@/hooks/useAuth';
import { YearlyForecast } from './YearlyForecast';
import { BudgetOverview } from './BudgetOverview';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { MonthlySummary } from './MonthlySummary';
import { SettingsModal } from './SettingsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Calendar, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export const BudgetDashboard = () => {
  const { signOut } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
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

  const handleSignOut = async () => {
    await signOut();
  };

  const getCurrentMonth = () => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(currentDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
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
            <div className="flex items-center gap-4 mt-2">
              <p className="text-muted-foreground">
                Track your 50/30/20 budget for
              </p>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="h-6 w-6 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-medium min-w-[120px] text-center">
                  {getCurrentMonth()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="h-6 w-6 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <SettingsModal 
              settings={settings}
              onUpdateSettings={updateSettings}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
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
            remainingBudget={remainingBudget}
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