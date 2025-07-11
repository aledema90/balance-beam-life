import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MonthlyBudget, CategorySpending } from '@/types/budget';
import { ChevronLeft, ChevronRight, TrendingUp, Calendar, Target } from 'lucide-react';

interface YearlyForecastProps {
  monthlyBudget: MonthlyBudget;
  currentSpending: CategorySpending;
}

interface MonthlyProjection {
  month: string;
  monthNumber: number;
  income: number;
  projectedSpending: {
    needs: number;
    wants: number;
    savings: number;
  };
  cumulativeSavings: number;
  budgetHealth: 'good' | 'warning' | 'danger';
}

export const YearlyForecast = ({ monthlyBudget, currentSpending }: YearlyForecastProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMonthName = (monthIndex: number) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      new Date(2024, monthIndex, 1)
    );
  };

  const calculateProjections = (): MonthlyProjection[] => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculate spending rate based on current month (if we have data)
    const totalCurrentSpending = currentSpending.needs + currentSpending.wants + currentSpending.savings;
    const spendingRates = {
      needs: totalCurrentSpending > 0 ? currentSpending.needs / monthlyBudget.needs : 0.85, // Default 85% if no data
      wants: totalCurrentSpending > 0 ? currentSpending.wants / monthlyBudget.wants : 0.70, // Default 70% if no data
      savings: totalCurrentSpending > 0 ? currentSpending.savings / monthlyBudget.savings : 0.90, // Default 90% if no data
    };

    let cumulativeSavings = 0;
    
    return Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;
      const month = getMonthName(index);
      
      // For past months or current month, use actual data if available
      const isCurrentMonth = selectedYear === currentYear && index === currentMonth;
      const isPastMonth = selectedYear < currentYear || (selectedYear === currentYear && index < currentMonth);
      
      let projectedSpending;
      if (isCurrentMonth) {
        projectedSpending = currentSpending;
      } else {
        // Project future spending based on current patterns
        projectedSpending = {
          needs: Math.round(monthlyBudget.needs * spendingRates.needs),
          wants: Math.round(monthlyBudget.wants * spendingRates.wants),
          savings: Math.round(monthlyBudget.savings * spendingRates.savings),
        };
      }

      cumulativeSavings += projectedSpending.savings;

      // Determine budget health
      const totalSpending = projectedSpending.needs + projectedSpending.wants + projectedSpending.savings;
      const spendingRatio = totalSpending / monthlyBudget.total;
      
      let budgetHealth: 'good' | 'warning' | 'danger' = 'good';
      if (spendingRatio > 1.05) {
        budgetHealth = 'danger';
      } else if (spendingRatio > 0.95) {
        budgetHealth = 'warning';
      }

      return {
        month,
        monthNumber,
        income: monthlyBudget.total,
        projectedSpending,
        cumulativeSavings,
        budgetHealth
      };
    });
  };

  const projections = calculateProjections();
  const yearEndSavings = projections[projections.length - 1]?.cumulativeSavings || 0;
  const targetYearlyIncome = monthlyBudget.total * 12;
  const projectedYearlySpending = projections.reduce((sum, month) => 
    sum + month.projectedSpending.needs + month.projectedSpending.wants + month.projectedSpending.savings, 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Yearly Forecast
          </h2>
          <p className="text-sm text-muted-foreground">
            Month-by-month projections based on current spending patterns
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedYear(prev => prev - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="px-4 py-2 bg-primary/10 rounded-md font-medium">
            {selectedYear}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedYear(prev => prev + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Yearly Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Projected Annual Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">
              {formatCurrency(targetYearlyIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Projected Annual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {formatCurrency(projectedYearlySpending)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Year-End Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-savings">
              {formatCurrency(yearEndSavings)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {((yearEndSavings / targetYearlyIncome) * 100).toFixed(1)}%
            </div>
            <Badge 
              variant={yearEndSavings / targetYearlyIncome >= 0.20 ? "default" : "secondary"}
              className="text-xs mt-1"
            >
              Target: 20%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Month</th>
                  <th className="text-right py-3 px-2">Income</th>
                  <th className="text-right py-3 px-2">Needs</th>
                  <th className="text-right py-3 px-2">Wants</th>
                  <th className="text-right py-3 px-2">Savings</th>
                  <th className="text-right py-3 px-2">Total Savings</th>
                  <th className="text-center py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((month, index) => {
                  const isCurrentMonth = selectedYear === new Date().getFullYear() && 
                                        index === new Date().getMonth();
                  
                  return (
                    <tr 
                      key={month.month}
                      className={`border-b hover:bg-accent/50 ${
                        isCurrentMonth ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="py-3 px-2 font-medium">
                        <div className="flex items-center gap-2">
                          {month.month}
                          {isCurrentMonth && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        {formatCurrency(month.income)}
                      </td>
                      <td className="py-3 px-2 text-right text-needs">
                        {formatCurrency(month.projectedSpending.needs)}
                      </td>
                      <td className="py-3 px-2 text-right text-wants">
                        {formatCurrency(month.projectedSpending.wants)}
                      </td>
                      <td className="py-3 px-2 text-right text-savings">
                        {formatCurrency(month.projectedSpending.savings)}
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-savings">
                        {formatCurrency(month.cumulativeSavings)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge 
                          variant={
                            month.budgetHealth === 'good' ? 'default' :
                            month.budgetHealth === 'warning' ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {month.budgetHealth === 'good' ? '✓' : 
                           month.budgetHealth === 'warning' ? '⚠' : '⚠'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goal Progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Savings Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>20% Annual Savings Target</span>
              <span className="font-semibold">
                {formatCurrency(targetYearlyIncome * 0.20)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Projected Annual Savings</span>
              <span className={`font-semibold ${
                yearEndSavings >= targetYearlyIncome * 0.20 ? 'text-success' : 'text-warning'
              }`}>
                {formatCurrency(yearEndSavings)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Difference</span>
              <span className={`font-semibold ${
                yearEndSavings >= targetYearlyIncome * 0.20 ? 'text-success' : 'text-destructive'
              }`}>
                {formatCurrency(yearEndSavings - (targetYearlyIncome * 0.20))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};