
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

const AddTrade = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [asset, setAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [outcome, setOutcome] = useState<'profit' | 'loss'>('profit');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addTrade } = useAuth();
  const navigate = useNavigate();

  const commonAssets = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD',
    'Gold', 'Silver', 'Oil', 'Bitcoin', 'Ethereum',
    'Apple', 'Tesla', 'Amazon', 'Google', 'Microsoft'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!asset.trim()) {
        toast({
          title: "Asset required",
          description: "Please enter or select an asset/instrument.",
          variant: "destructive",
        });
        return;
      }

      const tradeAmount = parseFloat(amount);
      const tradeValue = parseFloat(value);

      if (isNaN(tradeAmount) || tradeAmount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid trade amount.",
          variant: "destructive",
        });
        return;
      }

      if (isNaN(tradeValue) || tradeValue <= 0) {
        toast({
          title: "Invalid value",
          description: "Please enter a valid profit/loss value.",
          variant: "destructive",
        });
        return;
      }

      addTrade({
        date: date.toISOString().split('T')[0],
        asset: asset.trim(),
        amount: tradeAmount,
        outcome,
        value: tradeValue,
        notes: notes.trim() || undefined
      });

      toast({
        title: "Trade added successfully!",
        description: `${outcome === 'profit' ? 'Profit' : 'Loss'} of $${tradeValue.toFixed(2)} recorded for ${asset}.`,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add trade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add New Trade</CardTitle>
            <CardDescription>
              Record your latest Deriv trading result
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date */}
              <div className="space-y-2">
                <Label>Date of Trade</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Asset */}
              <div className="space-y-2">
                <Label htmlFor="asset">Asset/Instrument</Label>
                <Select value={asset} onValueChange={setAsset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an asset or type custom" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {commonAssets.map((assetOption) => (
                      <SelectItem key={assetOption} value={assetOption}>
                        {assetOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="asset"
                  placeholder="Or enter custom asset name"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                />
              </div>

              {/* Trade Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Trade Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* Outcome */}
              <div className="space-y-2">
                <Label>Outcome</Label>
                <RadioGroup value={outcome} onValueChange={(value: 'profit' | 'loss') => setOutcome(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="profit" id="profit" />
                    <Label htmlFor="profit" className="text-green-600 font-medium">Profit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="loss" id="loss" />
                    <Label htmlFor="loss" className="text-red-600 font-medium">Loss</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Value */}
              <div className="space-y-2">
                <Label htmlFor="value">
                  {outcome === 'profit' ? 'Profit' : 'Loss'} Value ($)
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter the absolute value - we'll handle the sign automatically
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this trade..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding Trade...' : 'Add Trade'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTrade;
