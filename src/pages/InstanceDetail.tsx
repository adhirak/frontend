import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, BookOpen, Clock, Users } from 'lucide-react';
import { CourseInstance } from '../types';
import { api, ApiError } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';

const InstanceDetail: React.FC = () => {
  const { year, semester, courseId } = useParams<{
    year: string;
    semester: string;
    courseId: string;
  }>();
  const navigate = useNavigate();
  const [instance, setInstance] = useState<CourseInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadInstance();
  }, [year, semester, courseId]);

  const loadInstance = async () => {
    if (!year || !semester || !courseId) {
      setToast({ message: 'Invalid instance parameters', type: 'error' });
      return;
    }

    try {
      const data = await api.getInstance(parseInt(year), parseInt(semester) as 1 | 2, courseId);
      setInstance(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setToast({ message: error.message, type: 'error' });
      } else {
        setToast({ message: 'Failed to load instance details', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getSemesterName = (sem: number, yr: number) => {
    const semesterName = sem === 1 ? 'Spring' : 'Fall';
    return `${semesterName} ${yr}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl sm:text-2xl font-bold text-primary">Loading instance details...</div>
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <Card>
          <div className="text-center py-8 sm:py-12">
            <h3 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Instance not found</h3>
            <p className="text-sm sm:text-base text-gray-500 font-medium mb-6">
              The requested course instance could not be found.
            </p>
            <Button
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => navigate('/instances')}
              className="w-full sm:w-auto"
            >
              Back to Instances
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-primary mb-2">
            {instance.courseId} - {getSemesterName(instance.semester, instance.year)}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Complete course instance information
          </p>
        </div>
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/instances')}
          className="w-full sm:w-auto"
        >
          Back to Instances
        </Button>
      </div>

      {/* Instance Overview */}
      <Card title="Instance Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-accent text-white p-3 border-2 border-black">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-600">Course ID</div>
              <div className="text-base sm:text-lg font-black text-primary">{instance.courseId}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-success text-white p-3 border-2 border-black">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-600">Year</div>
              <div className="text-base sm:text-lg font-black text-primary">{instance.year}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 text-white p-3 border-2 border-black">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-600">Semester</div>
              <div className="text-base sm:text-lg font-black text-primary">
                {instance.semester === 1 ? 'Spring' : 'Fall'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-purple-500 text-white p-3 border-2 border-black">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-600">Status</div>
              <div className="text-base sm:text-lg font-black text-success">Active</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Course Information */}
      {instance.course && (
        <Card title="Course Information">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-primary mb-2">
                {instance.course.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                {instance.course.description}
              </p>
            </div>

            {/* Prerequisites */}
            <div>
              <h4 className="text-base sm:text-lg font-bold text-primary mb-3">Prerequisites</h4>
              {instance.course.prerequisites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {instance.course.prerequisites.map((prereq) => (
                    <div
                      key={prereq}
                      className="bg-gray-100 p-4 border-2 border-gray-300 flex items-center space-x-3"
                    >
                      <div className="bg-gray-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold border border-black">
                        {prereq}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-600">
                        Required prerequisite
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 p-4 border-2 border-green-200 text-center">
                  <p className="text-sm sm:text-base text-green-700 font-medium">
                    No prerequisites required for this course
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Schedule Details */}
      <Card title="Schedule Details">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-600 mb-2">Academic Period</h4>
              <div className="bg-accent text-white p-4 border-2 border-black">
                <div className="text-base sm:text-lg font-bold">
                  {getSemesterName(instance.semester, instance.year)}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-600 mb-2">Course Duration</h4>
              <div className="bg-gray-100 p-4 border-2 border-gray-300">
                <div className="text-xs sm:text-sm font-medium text-gray-700">
                  Full semester (approximately 16 weeks)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-600 mb-2">Registration Status</h4>
              <div className="bg-success text-white p-4 border-2 border-black">
                <div className="text-base sm:text-lg font-bold">Open for Enrollment</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-600 mb-2">Course Format</h4>
              <div className="bg-gray-100 p-4 border-2 border-gray-300">
                <div className="text-xs sm:text-sm font-medium text-gray-700">
                  Standard lecture format
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-center">
        <Button
          variant="secondary"
          onClick={() => navigate('/instances')}
          className="w-full sm:w-auto"
        >
          View All Instances
        </Button>
      </div>
    </div>
  );
};

export default InstanceDetail;