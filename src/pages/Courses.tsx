import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, AlertTriangle, BookOpen } from 'lucide-react';
import { Course } from '../types';
import { api, ApiError } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setToast({ message: 'Failed to load courses', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm(`Are you sure you want to delete course ${courseId}?`)) {
      return;
    }

    try {
      await api.deleteCourse(courseId);
      setCourses(courses.filter(c => c.courseId !== courseId));
      setToast({ message: `Course ${courseId} deleted successfully`, type: 'success' });
    } catch (error) {
      if (error instanceof ApiError) {
        setToast({ message: error.message, type: 'error' });
      } else {
        setToast({ message: 'Failed to delete course', type: 'error' });
      }
    }
  };

  const getDependentCourses = (courseId: string) => {
    return courses.filter(course => course.prerequisites.includes(courseId));
  };

  const canDelete = (courseId: string) => {
    return getDependentCourses(courseId).length === 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl sm:text-2xl font-bold text-primary">Loading courses...</div>
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
          <h1 className="text-2xl sm:text-3xl font-black text-primary mb-2">Course Management</h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Manage your courses and their prerequisites
          </p>
        </div>
        <Link to="/courses/new">
          <Button icon={Plus} className="w-full sm:w-auto">Add New Course</Button>
        </Link>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Card>
          <div className="text-center py-8 sm:py-12">
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">No courses yet</h3>
            <p className="text-sm sm:text-base text-gray-500 font-medium mb-6">
              Get started by adding your first course
            </p>
            <Link to="/courses/new">
              <Button icon={Plus} className="w-full sm:w-auto">Add Your First Course</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {courses.map((course) => {
            const dependentCourses = getDependentCourses(course.courseId);
            const deletable = canDelete(course.courseId);

            return (
              <Card key={course.courseId} className="h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-accent text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold border border-black">
                        {course.courseId}
                      </span>
                      {!deletable && (
                        <div className="relative group">
                          <div className="flex items-center text-orange-500 cursor-help">
                            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="text-xs font-bold">Protected</span>
                          </div>
                          {/* Tooltip */}
                          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                            <div className="bg-primary text-white px-3 py-2 text-xs font-medium rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                              Course can't be deleted since it is a prerequisite
                              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-primary mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-4">
                      {course.description}
                    </p>
                  </div>

                  {/* Prerequisites - Fixed height container */}
                  <div className="mb-4 min-h-[80px] flex flex-col">
                    <h4 className="text-xs sm:text-sm font-bold text-primary mb-2">Prerequisites:</h4>
                    <div className="flex-1 flex items-start">
                      {course.prerequisites.length > 0 ? (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {course.prerequisites.map((prereq) => (
                            <span
                              key={prereq}
                              className="bg-gray-200 text-primary px-2 py-1 text-xs font-bold border border-black"
                            >
                              {prereq}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">None</span>
                      )}
                    </div>
                  </div>

                  {/* Dependent Courses - Fixed height container */}
                  <div className="mb-4 min-h-[60px] flex flex-col">
                    {dependentCourses.length > 0 && (
                      <>
                        <h4 className="text-xs sm:text-sm font-bold text-primary mb-2">Required by:</h4>
                        <div className="flex-1 flex items-start">
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {dependentCourses.map((dep) => (
                              <span
                                key={dep.courseId}
                                className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-bold border border-orange-300"
                              >
                                {dep.courseId}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions - Always at bottom */}
                  <div className="flex justify-end mt-auto pt-4">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(course.courseId)}
                      disabled={!deletable}
                      title={!deletable ? 'Cannot delete: This course is a prerequisite for other courses' : ''}
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;