import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Plus, 
  Home, 
  Menu, 
  X 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Course Instances', href: '/instances', icon: Calendar },
    { name: 'Add Course', href: '/courses/new', icon: Plus },
    { name: 'Add Instance', href: '/instances/new', icon: Plus },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-contrast font-inter flex flex-col">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b-4 border-black">
          <div>
            <h1 className="text-xl font-black text-white">EduMatrix</h1>
            <p className="text-xs text-gray-300 font-medium">Map. Manage. Master.</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-3 mb-2 text-sm font-bold rounded-none border-2 border-black
                  transition-all duration-200 transform hover:scale-105
                  ${isActive(item.href)
                    ? 'bg-accent text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-primary hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-white border-b-4 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-primary hover:bg-gray-100 rounded-none border-2 border-black transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-xl sm:text-2xl font-black text-primary">Course Management System</h2>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary border-t-4 border-black shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-white font-medium">
                All copyrights belong to <span className="font-black">Adhira K</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;