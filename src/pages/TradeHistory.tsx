
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const TradeHistory = () => {
  const { trades, deleteTrade } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'asset' | 'value'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades.filter(trade => 
      trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'asset':
          comparison = a.asset.localeCompare(b.asset);
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [trades, searchTerm, sortBy, sortOrder]);

  const totalPL = useMemo(() => {
    return filteredAndSortedTrades.reduce((sum, trade) => sum + trade.value, 0);
  }, [filteredAndSortedTrades]);

  const handleSort = (column: 'date' | 'asset' | 'value') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleDelete = (id: string, asset: string) => {
    if (window.confirm(`Are you sure you want to delete the ${asset} trade?`)) {
      deleteTrade(id);
      toast({
        title: "Trade deleted",
        description: `${asset} trade has been removed from your history.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trade History</h1>
          <p className="text-gray-600 mt-2">
            View and manage all your trading records
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {totalPL >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span>Running Total P&L</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
            </div>
            <p className="text-gray-500">
              From {filteredAndSortedTrades.length} trades
            </p>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by asset or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Trade Table */}
        <Card>
          <CardContent className="p-0">
            {filteredAndSortedTrades.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {trades.length === 0 ? 'No trades recorded yet' : 'No trades match your search'}
                </p>
                {trades.length === 0 && (
                  <Button onClick={() => window.location.href = '/add-trade'}>
                    Add Your First Trade
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('date')}
                    >
                      Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('asset')}
                    >
                      Asset {sortBy === 'asset' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </TableHead>
                    <TableHead>Trade Amount</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('value')}
                    >
                      P&L {sortBy === 'value' && (sortOrder === 'desc' ? '↓' : '↑')}
                    </TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        {new Date(trade.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {trade.asset}
                      </TableCell>
                      <TableCell>
                        ${trade.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={trade.value > 0 ? "default" : "destructive"}
                            className={trade.value > 0 ? "bg-green-100 text-green-800" : ""}
                          >
                            {trade.value > 0 ? 'Profit' : 'Loss'}
                          </Badge>
                          <span className={`font-bold ${trade.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.value > 0 ? '+' : ''}${trade.value.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {trade.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Edit trade"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(trade.id, trade.asset)}
                            title="Delete trade"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradeHistory;
