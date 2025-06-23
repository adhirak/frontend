import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Plus, BarChart3 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const Home: React.FC = () => {
  const features = [
    {
      title: 'Course Management',
      description: 'Create and manage courses with prerequisite validation',
      icon: BookOpen,
      link: '/courses',
      color: 'bg-accent'
    },
    {
      title: 'Instance Scheduling',
      description: 'Schedule course instances by year and semester',
      icon: Calendar,
      link: '/instances',
      color: 'bg-success'
    },
    {
      title: 'Quick Actions',
      description: 'Rapidly add new courses and instances',
      icon: Plus,
      link: '/courses/new',
      color: 'bg-orange-500'
    },
    {
      title: 'Analytics',
      description: 'Track course dependencies and scheduling patterns',
      icon: BarChart3,
      link: '/courses',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-4">
          EduMatrix
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-gray-600 mb-8">
          Map. Manage. Master Your Courses.
        </p>
        <div className="bg-accent text-white p-4 sm:p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block max-w-2xl mx-auto">
          <p className="text-base sm:text-lg font-bold">
            Comprehensive course management with dependency tracking
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:transform hover:scale-105 transition-transform duration-200 h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-3 ${feature.color} text-white border-2 border-black flex-shrink-0`}>
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-black text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link to={feature.link}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card title="System Overview">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 bg-contrast border-2 border-black">
            <div className="text-2xl sm:text-3xl font-black text-accent mb-2">4</div>
            <div className="text-xs sm:text-sm font-bold text-primary">Total Courses</div>
          </div>
          <div className="text-center p-4 bg-contrast border-2 border-black">
            <div className="text-2xl sm:text-3xl font-black text-success mb-2">4</div>
            <div className="text-xs sm:text-sm font-bold text-primary">Active Instances</div>
          </div>
          <div className="text-center p-4 bg-contrast border-2 border-black">
            <div className="text-2xl sm:text-3xl font-black text-orange-500 mb-2">3</div>
            <div className="text-xs sm:text-sm font-bold text-primary">Prerequisites</div>
          </div>
        </div>
      </Card>

      {/* Getting Started */}
      <Card title="Getting Started">
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Welcome to EduMatrix! Here's how to get started with managing your courses:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-700 font-medium">
            <li>Create courses with detailed descriptions and prerequisites</li>
            <li>Schedule course instances for specific years and semesters</li>
            <li>Manage dependencies between courses automatically</li>
            <li>Track and organize your entire curriculum</li>
          </ol>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Link to="/courses/new">
              <Button icon={Plus} className="w-full sm:w-auto">Add Your First Course</Button>
            </Link>
            <Link to="/courses">
              <Button variant="secondary" className="w-full sm:w-auto">View All Courses</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;