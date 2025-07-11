import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetSettings } from '@/types/budget';
import { Settings, Save } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdateSettings({
      monthlyIncome: parseFloat(formData.monthlyIncome),
      fixedExpenses: {
        mortgage: parseFloat(formData.mortgage),
        carPayment: parseFloat(formData.carPayment)
      }
    });
    
    setIsOpen(false);
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
      <DialogContent className="sm:max-w-md">
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
              <CardTitle className="text-base">Fixed Expenses</CardTitle>
              <CardDescription>
                Recurring monthly expenses automatically deducted
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