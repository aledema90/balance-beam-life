import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Expense, ExpenseCategory } from '@/types/budget';
import { Trash2, Edit, Calendar, Euro, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (id: string, updates: Partial<Expense>) => void;
}

export const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense }: ExpenseListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    const colors = {
      needs: 'bg-needs text-needs-foreground',
      wants: 'bg-wants text-wants-foreground',
      savings: 'bg-savings text-savings-foreground'
    };
    return colors[category];
  };

  const getCategoryIcon = (category: ExpenseCategory) => {
    const icons = {
      needs: '🏠',
      wants: '🎯',
      savings: '💰'
    };
    return icons[category];
  };

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (expenses.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="py-12 text-center">
          <div className="text-muted-foreground">
            <Euro className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No expenses yet</p>
            <p className="text-sm">Add your first expense to start tracking your budget</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedExpenses.map((expense) => (
            <div 
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-lg">
                  {getCategoryIcon(expense.category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {expense.description}
                    </p>
                    <div className="flex gap-1">
                      {expense.isFixed && (
                        <Badge variant="secondary" className="text-xs">
                          Fixed
                        </Badge>
                      )}
                      {expense.isActual === true ? (
                        <Badge variant="default" className="text-xs bg-success/20 text-success">
                          <Check className="w-3 h-3 mr-1" />
                          Actual
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          Planned
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(expense.date)}</span>
                    <Badge 
                      className={`${getCategoryColor(expense.category)} text-xs px-2 py-0`}
                    >
                      {expense.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {formatCurrency(expense.amount)}
                </span>
                
                {!expense.isFixed && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(expense.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteExpense(expense.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};