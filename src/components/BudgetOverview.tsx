import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MonthlyBudget, CategorySpending } from '@/types/budget';

interface BudgetOverviewProps {
  budget: MonthlyBudget;
  spending: CategorySpending;
}

export const BudgetOverview = ({ budget, spending }: BudgetOverviewProps) => {
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
      spent: spending.needs
    },
    {
      name: 'Wants',
      key: 'wants' as const,
      color: 'bg-wants',
      percentage: 30,
      budget: budget.wants,
      spent: spending.wants
    },
    {
      name: 'Savings',
      key: 'savings' as const,
      color: 'bg-savings',
      percentage: 20,
      budget: budget.savings,
      spent: spending.savings
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {categories.map((category) => {
        const percentageUsed = getPercentageUsed(category.spent, category.budget);
        const remaining = category.budget - category.spent;
        const isOverBudget = category.spent > category.budget;

        return (
          <Card key={category.key} className="shadow-card">
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
                  <span>Spent</span>
                  <span className={`font-medium ${isOverBudget ? 'text-destructive' : ''}`}>
                    {formatCurrency(category.spent)}
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};