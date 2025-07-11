import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MonthlyBudget, CategorySpending } from '@/types/budget';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';

interface MonthlySummaryProps {
  budget: MonthlyBudget;
  spending: CategorySpending;
  remainingBudget: {
    needs: number;
    wants: number;
    savings: number;
    total: number;
  };
}

export const MonthlySummary = ({ budget, spending, remainingBudget }: MonthlySummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const totalSpent = spending.needs + spending.wants + spending.savings;
  const savingsRate = budget.total > 0 ? (spending.savings / budget.total) * 100 : 0;
  const isOnTrack = savingsRate >= 20;

  const getCurrentMonth = () => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(budget.total)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {getCurrentMonth()}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Total Spent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalSpent)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={totalSpent > budget.total ? "destructive" : "secondary"} className="text-xs">
              {((totalSpent / budget.total) * 100).toFixed(1)}% of income
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4" />
            Savings Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={isOnTrack ? "default" : "secondary"} className="text-xs">
              Target: 20%
            </Badge>
            {isOnTrack ? (
              <TrendingUp className="w-3 h-3 text-success" />
            ) : (
              <TrendingDown className="w-3 h-3 text-warning" />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Remaining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            remainingBudget.total >= 0 ? 'text-success' : 'text-destructive'
          }`}>
            {formatCurrency(remainingBudget.total)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {remainingBudget.total >= 0 ? 'Available to spend' : 'Over budget'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};