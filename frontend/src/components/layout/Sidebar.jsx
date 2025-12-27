import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  PieChart,
  Wallet,
  Settings,
  User,
  X,
  TrendingUp,
} from 'lucide-react';
import { classNames } from '../../utils/helpers';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Categories', href: '/categories', icon: Tags },
  { name: 'Reports', href: '/reports', icon: PieChart },
  { name: 'Budgets', href: '/budgets', icon: Wallet },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Profile', href: '/profile', icon: User },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={classNames(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50',
          'transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                FinTrack
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Bottom navigation */}
          <div className="px-3 py-4 border-t space-y-1">
            {bottomNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

