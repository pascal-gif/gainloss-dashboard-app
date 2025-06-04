
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, BarChart3, Target } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <TrendingUp className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your <span className="text-blue-600">Deriv Trading</span> Performance
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Monitor your profits and losses with ease. GainLoss helps you understand your trading patterns 
            and make better decisions with comprehensive P&L tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Comprehensive Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Record every trade with detailed information including date, asset, amount, and outcome.
                See your complete trading history at a glance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Real-time P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically calculate your total profits, losses, and net P&L. 
                Understand your trading performance with clear metrics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your trading data is secure and private. Only you have access to your 
                trading records and performance metrics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Take Control of Your Trading?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of traders who use GainLoss to track their performance and improve their results.
          </p>
          <Link to="/signup">
            <Button size="lg">
              Start Tracking Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
