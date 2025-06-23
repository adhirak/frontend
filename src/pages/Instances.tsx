import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Trash2, Eye } from 'lucide-react';
import { CourseInstance } from '../types';
import { api, ApiError } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import Toast from '../components/Toast';

const Instances: React.FC = () => {
  const [instances, setInstances] = useState<CourseInstance[]>([]);
  const [filteredInstances, setFilteredInstances] = useState<CourseInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterSemester, setFilterSemester] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadInstances();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [instances, filterYear, filterSemester]);

  const loadInstances = async () => {
    try {
      const data = await api.getInstances();
      setInstances(data);
    } catch (error) {
      console.error('Failed to load instances:', error);
      setToast({ message: 'Failed to load course instances', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...instances];
    
    if (filterYear) {
      filtered = filtered.filter(instance => instance.year === parseInt(filterYear));
    }
    
    if (filterSemester) {
      filtered = filtered.filter(instance => instance.semester === parseInt(filterSemester));
    }
    
    setFilteredInstances(filtered);
  };

  const handleDelete = async (year: number, semester: number, courseId: string) => {
    if (!confirm(`Are you sure you want to delete the instance of ${courseId} for ${year} Semester ${semester}?`)) {
      return;
    }

    try {
      await api.deleteInstance(year, semester, courseId);
      setInstances(instances.filter(i => 
        !(i.year === year && i.semester === semester && i.courseId === courseId)
      ));
      setToast({ message: 'Course instance deleted successfully', type: 'success' });
    } catch (error) {
      if (error instanceof ApiError) {
        setToast({ message: error.message, type: 'error' });
      } else {
        setToast({ message: 'Failed to delete course instance', type: 'error' });
      }
    }
  };

  const getUniqueYears = () => {
    const years = [...new Set(instances.map(i => i.year))].sort((a, b) => b - a);
    return years.map(year => ({ value: year.toString(), label: year.toString() }));
  };

  const semesterOptions = [
    { value: '1', label: 'Semester 1 (Spring)' },
    { value: '2', label: 'Semester 2 (Fall)' }
  ];

  const groupedInstances = filteredInstances.reduce((groups, instance) => {
    const key = `${instance.year}-${instance.semester}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(instance);
    return groups;
  }, {} as Record<string, CourseInstance[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl sm:text-2xl font-bold text-primary">Loading instances...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary mb-2">Course Instances</h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Manage course scheduling by year and semester
          </p>
        </div>
        <Link to="/instances/new">
          <Button icon={Plus} className="w-full sm:w-auto">Add New Instance</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card title="Filter Instances">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Year"
            value={filterYear}
            onChange={setFilterYear}
            options={getUniqueYears()}
            placeholder="All years"
          />
          <Select
            label="Semester"
            value={filterSemester}
            onChange={setFilterSemester}
            options={semesterOptions}
            placeholder="All semesters"
          />
          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setFilterYear('');
                setFilterSemester('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Instances */}
      {filteredInstances.length === 0 ? (
        <Card>
          <div className="text-center py-8 sm:py-12">
            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">
              {instances.length === 0 ? 'No course instances yet' : 'No instances match your filters'}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 font-medium mb-6">
              {instances.length === 0 
                ? 'Get started by scheduling your first course instance'
                : 'Try adjusting your filters or add a new instance'
              }
            </p>
            <Link to="/instances/new">
              <Button icon={Plus} className="w-full sm:w-auto">Add New Instance</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedInstances)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([key, groupInstances]) => {
              const [year, semester] = key.split('-');
              const semesterName = semester === '1' ? 'Spring' : 'Fall';
              
              return (
                <Card key={key} title={`${year} - ${semesterName} Semester`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {groupInstances.map((instance) => (
                      <div
                        key={`${instance.courseId}-${instance.year}-${instance.semester}`}
                        className="bg-contrast p-4 border-2 border-black h-full flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-accent text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold border border-black">
                            {instance.courseId}
                          </span>
                        </div>
                        
                        <h4 className="text-sm sm:text-base font-bold text-primary mb-2">
                          {instance.course?.title || 'Unknown Course'}
                        </h4>
                        
                        <p className="text-xs sm:text-sm text-gray-600 font-medium mb-4 flex-grow">
                          {instance.course?.description || 'No description available'}
                        </p>
                        
                        <div className="flex flex-col gap-2 mt-auto">
                          <Link to={`/instances/${instance.year}/${instance.semester}/${instance.courseId}`}>
                            <Button variant="secondary" size="sm" icon={Eye} className="w-full">
                              View Details
                            </Button>
                          </Link>
                          
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            className="w-full"
                            onClick={() => handleDelete(instance.year, instance.semester, instance.courseId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Instances;