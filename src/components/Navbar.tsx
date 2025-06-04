
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, User, LogOut, Plus, History, BarChart3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">GainLoss</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Link to="/add-trade">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Plus className="h-4 w-4" />
                      <span>Add Trade</span>
                    </Button>
                  </Link>
                  <Link to="/trade-history">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <History className="h-4 w-4" />
                      <span>History</span>
                    </Button>
                  </Link>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.fullName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link to="/dashboard" className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link to="/add-trade" className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Trade</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="md:hidden">
                      <Link to="/trade-history" className="flex items-center space-x-2">
                        <History className="h-4 w-4" />
                        <span>Trade History</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
