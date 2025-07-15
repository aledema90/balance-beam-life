import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MonthlyBudget, CategorySpending, Expense, ExpenseCategory } from '@/types/budget';
import { CategoryModal } from './CategoryModal';
import { Eye } from 'lucide-react';

interface BudgetOverviewProps {
  budget: MonthlyBudget;
  spending: CategorySpending;
  plannedSpending: CategorySpending;
  remainingBudget: {
    needs: number;
    wants: number;
    savings: number;
    total: number;
  };
  getAllExpensesByCategory: (category: string, monthYear?: string) => Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (id: string, updates: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
}

export const BudgetOverview = ({ 
  budget, 
  spending, 
  plannedSpending,
  remainingBudget,
  getAllExpensesByCategory,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense
}: BudgetOverviewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'savings' | null>(null);

  const getPercentageUsed = (spent: number, budgeted: number) => {
    return budgeted > 0 ? (spent / budgeted) * 100 : 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const categories = [
    {
      name: 'Needs',
      key: 'needs' as const,
      color: 'bg-needs',
      percentage: 50,
      budget: budget.needs,
      spent: spending.needs,
      planned: plannedSpending.needs
    },
    {
      name: 'Wants',
      key: 'wants' as const,
      color: 'bg-wants',
      percentage: 30,
      budget: budget.wants,
      spent: spending.wants,
      planned: plannedSpending.wants
    },
    {
      name: 'Savings',
      key: 'savings' as const,
      color: 'bg-savings',
      percentage: 20,
      budget: budget.savings,
      spent: 0, // Savings are calculated, not spent
      planned: 0, // No planned savings expenses
      isCalculated: true
    }
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => {
          const percentageUsed = getPercentageUsed(category.spent, category.budget);
          // For savings, use the calculated actual savings amount, otherwise use budget - spent
          const remaining = category.key === 'savings' ? remainingBudget.savings : category.budget - category.spent;
          const isOverBudget = category.spent > category.budget;

          return (
            <Card key={category.key} className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    {category.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {category.percentage}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Budget</span>
                  <span className="font-medium">{formatCurrency(category.budget)}</span>
                </div>
                
                <Progress 
                  value={Math.min(percentageUsed, 100)} 
                  className="h-2"
                  style={{
                    background: 'hsl(var(--muted))',
                  }}
                />
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Actually Spent</span>
                    <span className={`font-medium ${isOverBudget ? 'text-destructive' : ''}`}>
                      {formatCurrency(category.spent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planned</span>
                    <span className="font-medium text-muted-foreground">
                      {formatCurrency(category.planned)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining</span>
                    <span className={`font-medium ${
                      isOverBudget ? 'text-destructive' : remaining > 0 ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                </div>
                
                {isOverBudget && (
                  <p className="text-xs text-destructive font-medium">
                    Over budget by {formatCurrency(Math.abs(remaining))}
                  </p>
                )}

                {/* Only show View Details button for interactive categories */}
                {!category.isCalculated && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                )}
                
                {/* Show info for calculated categories */}
                {category.isCalculated && (
                  <div className="mt-3 p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground text-center">
                      Automatically calculated as remaining income
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Category Modal - only for interactive categories (needs, wants) */}
      {selectedCategory && selectedCategory !== 'savings' && (
        <CategoryModal
          isOpen={true}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory as ExpenseCategory}
          expenses={getAllExpensesByCategory(selectedCategory)}
          budgetAmount={budget[selectedCategory]}
          actualSpent={spending[selectedCategory]}
          plannedAmount={plannedSpending[selectedCategory]}
          onAddExpense={onAddExpense}
          onUpdateExpense={onUpdateExpense}
          onDeleteExpense={onDeleteExpense}
        />
      )}
    </>
  );
};