
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, TrendingUp, TrendingDown, Target, History } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const { user, trades } = useAuth();

  const stats = useMemo(() => {
    const totalTrades = trades.length;
    const totalProfit = trades
      .filter(trade => trade.value > 0)
      .reduce((sum, trade) => sum + trade.value, 0);
    const totalLoss = Math.abs(trades
      .filter(trade => trade.value < 0)
      .reduce((sum, trade) => sum + trade.value, 0));
    const netPL = totalProfit - totalLoss;

    return { totalTrades, totalProfit, totalLoss, netPL };
  }, [trades]);

  const recentTrades = trades
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your trading performance overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTrades}</div>
              <p className="text-xs text-muted-foreground">
                Trades logged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${stats.totalProfit.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From winning trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loss</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${stats.totalLoss.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From losing trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net P&L</CardTitle>
              <Target className={`h-4 w-4 ${stats.netPL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.netPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats.netPL.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link to="/add-trade">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span>Add New Trade</span>
                </CardTitle>
                <CardDescription>
                  Record your latest Deriv trading result
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <Link to="/trade-history">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-purple-600" />
                  <span>View Trade History</span>
                </CardTitle>
                <CardDescription>
                  Browse and manage all your trading records
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>
              Your latest trading activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTrades.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No trades recorded yet</p>
                <Link to="/add-trade">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Trade
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${trade.value > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{trade.asset}</p>
                        <p className="text-sm text-gray-500">{new Date(trade.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${trade.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.value > 0 ? '+' : ''}${trade.value.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">${trade.amount}</p>
                    </div>
                  </div>
                ))}
                
                {trades.length > 5 && (
                  <div className="text-center pt-4">
                    <Link to="/trade-history">
                      <Button variant="outline">View All Trades</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
