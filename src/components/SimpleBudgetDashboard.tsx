import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, Plus, ChevronLeft, ChevronRight, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { YearlyForecast } from './YearlyForecast';

const CategoryModal = ({ isOpen, onClose, onCreateCategory }: {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (name: string, type: 'income' | 'expense', color?: string) => void;
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [color, setColor] = useState('#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateCategory(name.trim(), type, color);
      setName('');
      setType('expense');
      setColor('#3B82F6');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Category</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CategoryCard = ({ category, onAddSubcategory, onEditSubcategory }: any) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editFrequency, setEditFrequency] = useState<'monthly' | 'custom'>('monthly');

  const handleAddSubcategory = () => {
    if (subcategoryName.trim()) {
      onAddSubcategory(category.id, subcategoryName.trim());
      setSubcategoryName('');
      setShowAddForm(false);
    }
  };

  const startEdit = (sub: any) => {
    setEditingId(sub.id);
    setEditAmount(sub.amount?.toString() || '0');
    setEditFrequency(sub.frequency || 'monthly');
  };

  const handleSaveEdit = () => {
    if (editingId && editAmount.trim()) {
      onEditSubcategory(category.id, editingId, {
        amount: parseFloat(editAmount),
        frequency: editFrequency
      });
      setEditingId(null);
      setEditAmount('');
      setEditFrequency('monthly');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
    setEditFrequency('monthly');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: category.color }}
            />
            <span>{category.name}</span>
            <Badge variant={category.type === 'income' ? 'default' : 'secondary'}>
              {category.type}
            </Badge>
          </div>
          <div className="text-lg font-bold">
            $0.00
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {category.subcategories?.map((sub: any) => (
            <div key={sub.id} className="p-3 bg-muted rounded-lg">
              {editingId === sub.id ? (
                <div className="space-y-3">
                  <div className="font-medium">{sub.name}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Amount</Label>
                      <Input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Frequency</Label>
                      <Select value={editFrequency} onValueChange={(value: 'monthly' | 'custom') => setEditFrequency(value)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{sub.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {sub.frequency && (
                        <Badge variant="outline" className="text-xs">
                          {sub.frequency === 'monthly' ? 'Monthly' : 'Custom'}
                        </Badge>
                      )}
                      {sub.is_recurring && (
                        <Badge variant="outline" className="text-xs">
                          Recurring
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right min-w-[80px]">
                      <div className="font-medium">${sub.amount || '0.00'}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => startEdit(sub)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {showAddForm ? (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border-2 border-dashed">
              <Input
                placeholder="Subcategory name"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddSubcategory}>
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subcategory
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const SimpleBudgetDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  
  // Sample data until database is connected
  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Salary',
      type: 'income',
      color: '#10B981',
      subcategories: [
        { id: '1-1', name: 'Main Job', is_recurring: true },
        { id: '1-2', name: 'Freelance', is_recurring: false }
      ]
    },
    {
      id: '2',
      name: 'Housing',
      type: 'expense',
      color: '#EF4444',
      subcategories: [
        { id: '2-1', name: 'Rent/Mortgage', is_recurring: true },
        { id: '2-2', name: 'Property Tax', is_recurring: true }
      ]
    },
    {
      id: '3',
      name: 'Food',
      type: 'expense',
      color: '#F59E0B',
      subcategories: [
        { id: '3-1', name: 'Groceries', is_recurring: false },
        { id: '3-2', name: 'Restaurants', is_recurring: false }
      ]
    }
  ]);

  const createCategory = (name: string, type: 'income' | 'expense', color: string = '#3B82F6') => {
    const newCategory = {
      id: Date.now().toString(),
      name,
      type,
      color,
      subcategories: []
    };
    setCategories(prev => [...prev, newCategory]);
    
    toast({
      title: "Success",
      description: `Category "${name}" created successfully.`,
    });
  };

  const createSubcategory = (categoryId: string, name: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            subcategories: [...cat.subcategories, {
              id: `${categoryId}-${Date.now()}`,
              name,
              is_recurring: false
            }]
          }
        : cat
    ));

    toast({
      title: "Success",
      description: `Subcategory "${name}" created successfully.`,
    });
  };

  const editSubcategory = (categoryId: string, subcategoryId: string, updates: { amount: number; frequency: 'monthly' | 'custom' }) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            subcategories: cat.subcategories.map(sub => 
              sub.id === subcategoryId 
                ? { ...sub, ...updates }
                : sub
            )
          }
        : cat
    ));

    toast({
      title: "Success",
      description: "Subcategory updated successfully.",
    });
  };

  // Sample forecast data
  const sampleBudget = {
    total: 5000,
    needs: 3000,
    wants: 1500,
    savings: 500
  };

  const sampleSpending = {
    needs: 2800,
    wants: 1200,
    savings: 0
  };

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
                Manage your budget for
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
            <Button 
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
            <Button 
              onClick={() => setShowForecast(!showForecast)}
              variant={showForecast ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              Forecast
            </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$0.00</div>
            </CardContent>
          </Card>
        </div>

        {/* Yearly Forecast */}
        {showForecast && (
          <div className="mb-8">
            <YearlyForecast 
              monthlyBudget={sampleBudget}
              currentSpending={sampleSpending}
            />
          </div>
        )}

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onAddSubcategory={createSubcategory}
              onEditSubcategory={editSubcategory}
            />
          ))}
        </div>

        {/* Category Modal */}
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onCreateCategory={createCategory}
        />
      </div>
    </div>
  );
};