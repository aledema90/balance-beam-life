import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Expense, ExpenseCategory } from '@/types/budget';
import { 
  Check, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: ExpenseCategory;
  expenses: Expense[];
  budgetAmount: number;
  actualSpent: number;
  plannedAmount: number;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (id: string, updates: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
}

export const CategoryModal = ({
  isOpen,
  onClose,
  category,
  expenses,
  budgetAmount,
  actualSpent,
  plannedAmount,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense
}: CategoryModalProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    isActual: true,
    plannedMonth: new Date().toISOString().slice(0, 7)
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getCategoryIcon = (category: ExpenseCategory) => {
    const icons = {
      needs: '🏠',
      wants: '🎯',
      savings: '💰'
    };
    return icons[category];
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    const colors = {
      needs: 'text-needs',
      wants: 'text-wants',
      savings: 'text-savings'
    };
    return colors[category];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    const expense = {
      date: formData.isActual ? formData.date : new Date().toISOString().split('T')[0],
      amount: parseFloat(formData.amount),
      category,
      description: formData.description,
      isActual: formData.isActual,
      plannedMonth: formData.isActual ? undefined : formData.plannedMonth
    };

    if (editingId) {
      onUpdateExpense(editingId, expense);
      setEditingId(null);
    } else {
      onAddExpense(expense);
    }

    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      description: '',
      isActual: true,
      plannedMonth: new Date().toISOString().slice(0, 7)
    });
    setShowAddForm(false);
  };

  const toggleExpenseStatus = (expense: Expense) => {
    onUpdateExpense(expense.id, { 
      isActual: !expense.isActual,
      date: expense.isActual ? expense.date : new Date().toISOString().split('T')[0]
    });
  };

  const startEdit = (expense: Expense) => {
    setFormData({
      date: expense.date,
      amount: expense.amount.toString(),
      description: expense.description,
      isActual: expense.isActual || false,
      plannedMonth: expense.plannedMonth || new Date().toISOString().slice(0, 7)
    });
    setEditingId(expense.id);
    setShowAddForm(true);
  };

  const actualExpenses = expenses.filter(e => e.isActual === true);
  const plannedExpenses = expenses.filter(e => e.isActual !== true);
  const remaining = budgetAmount - actualSpent;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">{getCategoryIcon(category)}</span>
            <span className={`capitalize ${getCategoryColor(category)}`}>
              {category}
            </span>
            <span className="text-sm text-muted-foreground font-normal">
              - Expense Overview
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatCurrency(budgetAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Actually Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold ${
                  actualSpent > budgetAmount ? 'text-destructive' : 'text-success'
                }`}>
                  {formatCurrency(actualSpent)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Planned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-muted-foreground">
                  {formatCurrency(plannedAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold ${
                  remaining >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {formatCurrency(remaining)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Expense Button/Form */}
          {!showAddForm ? (
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add {category} expense
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {editingId ? 'Edit Expense' : `Add ${category} expense`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="expense-type"
                      checked={formData.isActual}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, isActual: checked }))
                      }
                    />
                    <Label htmlFor="expense-type" className="text-sm">
                      {formData.isActual ? 'Actually happened' : 'Planned expense'}
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.isActual ? (
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="plannedMonth">Planned Month</Label>
                        <Input
                          id="plannedMonth"
                          type="month"
                          value={formData.plannedMonth}
                          onChange={(e) => setFormData(prev => ({ ...prev, plannedMonth: e.target.value }))}
                          required
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (€)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What was this expense for?"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingId ? 'Update' : 'Add'} Expense
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(null);
                        setFormData({
                          date: new Date().toISOString().split('T')[0],
                          amount: '',
                          description: '',
                          isActual: true,
                          plannedMonth: new Date().toISOString().slice(0, 7)
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Expense Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actual Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  Actually Happened ({actualExpenses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {actualExpenses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No actual expenses yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {actualExpenses
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((expense) => (
                        <div 
                          key={expense.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-success/5"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {expense.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(expense.date)}</span>
                              {expense.isFixed && (
                                <Badge variant="secondary" className="text-xs">
                                  Fixed
                                </Badge>
                              )}
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
                                  onClick={() => toggleExpenseStatus(expense)}
                                  className="h-8 w-8 p-0"
                                  title="Mark as planned"
                                >
                                  <Clock className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEdit(expense)}
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
                )}
              </CardContent>
            </Card>

            {/* Planned Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Planned ({plannedExpenses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {plannedExpenses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No planned expenses
                  </p>
                ) : (
                  <div className="space-y-3">
                    {plannedExpenses.map((expense) => (
                      <div 
                        key={expense.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {expense.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {expense.plannedMonth ? 
                                format(new Date(expense.plannedMonth + '-01'), 'MMM yyyy') :
                                'Not scheduled'
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-muted-foreground">
                            {formatCurrency(expense.amount)}
                          </span>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleExpenseStatus(expense)}
                              className="h-8 w-8 p-0"
                              title="Mark as actually happened"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(expense)}
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};