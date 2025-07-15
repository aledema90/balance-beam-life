import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BudgetSettings, FixedExpense, ExpenseCategory } from '@/types/budget';
import { Settings, Save, Plus, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  settings: BudgetSettings;
  onUpdateSettings: (settings: Partial<BudgetSettings>) => void;
}

export const SettingsModal = ({ settings, onUpdateSettings }: SettingsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    monthlyIncome: settings.monthlyIncome.toString(),
    mortgage: settings.fixedExpenses.mortgage.toString(),
    carPayment: settings.fixedExpenses.carPayment.toString()
  });
  const [customFixedExpenses, setCustomFixedExpenses] = useState<FixedExpense[]>(
    settings.customFixedExpenses || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdateSettings({
      monthlyIncome: parseFloat(formData.monthlyIncome),
      fixedExpenses: {
        mortgage: parseFloat(formData.mortgage),
        carPayment: parseFloat(formData.carPayment)
      },
      customFixedExpenses
    });
    
    setIsOpen(false);
  };

  const addFixedExpense = () => {
    const newExpense: FixedExpense = {
      id: Date.now().toString(),
      name: '',
      value: 0,
      category: 'needs',
      recurrence: 'monthly'
    };
    setCustomFixedExpenses([...customFixedExpenses, newExpense]);
  };

  const updateFixedExpense = (id: string, updates: Partial<FixedExpense>) => {
    setCustomFixedExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  };

  const removeFixedExpense = (id: string) => {
    setCustomFixedExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Budget Settings</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Monthly Income</CardTitle>
              <CardDescription>
                Your salary received on the 15th of each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Amount (€)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    monthlyIncome: e.target.value 
                  }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Default Fixed Expenses</CardTitle>
              <CardDescription>
                Basic recurring monthly expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mortgage">Mortgage Payment (€)</Label>
                <Input
                  id="mortgage"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.mortgage}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    mortgage: e.target.value 
                  }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Charged on the 1st of each month
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carPayment">Car Payment (€)</Label>
                <Input
                  id="carPayment"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.carPayment}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    carPayment: e.target.value 
                  }))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Monthly installment
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                Custom Fixed Expenses
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addFixedExpense}
                  className="gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </CardTitle>
              <CardDescription>
                Add your own recurring expenses with custom schedules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customFixedExpenses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom fixed expenses added yet
                </p>
              ) : (
                customFixedExpenses.map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Fixed Expense</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFixedExpense(expense.id)}
                        className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${expense.id}`}>Name</Label>
                        <Input
                          id={`name-${expense.id}`}
                          placeholder="e.g., Netflix"
                          value={expense.name}
                          onChange={(e) => updateFixedExpense(expense.id, { name: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`value-${expense.id}`}>Amount (€)</Label>
                        <Input
                          id={`value-${expense.id}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={expense.value || ''}
                          onChange={(e) => updateFixedExpense(expense.id, { value: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`category-${expense.id}`}>Category</Label>
                        <Select
                          value={expense.category}
                          onValueChange={(value: ExpenseCategory) => 
                            updateFixedExpense(expense.id, { category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="needs">Needs</SelectItem>
                            <SelectItem value="wants">Wants</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`recurrence-${expense.id}`}>Recurrence</Label>
                        <Select
                          value={expense.recurrence.toString()}
                          onValueChange={(value) => 
                            updateFixedExpense(expense.id, { 
                              recurrence: value === 'monthly' ? 'monthly' : parseInt(value) 
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="7">Weekly (7 days)</SelectItem>
                            <SelectItem value="14">Bi-weekly (14 days)</SelectItem>
                            <SelectItem value="30">Every 30 days</SelectItem>
                            <SelectItem value="90">Quarterly (90 days)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">50/30/20 Budget Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Needs (50%):</span>
                <span className="font-medium text-needs">
                  {formatCurrency(parseFloat(formData.monthlyIncome || '0') * 0.5)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wants (30%):</span>
                <span className="font-medium text-wants">
                  {formatCurrency(parseFloat(formData.monthlyIncome || '0') * 0.3)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Savings (20%):</span>
                <span className="font-medium text-savings">
                  {formatCurrency(parseFloat(formData.monthlyIncome || '0') * 0.2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};