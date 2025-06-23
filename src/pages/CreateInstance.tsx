import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Course } from '../types';
import { api, ApiError } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import Toast from '../components/Toast';

const CreateInstance: React.FC = () => {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadAvailableCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      const course = availableCourses.find(c => c.courseId === courseId);
      setSelectedCourse(course || null);
    } else {
      setSelectedCourse(null);
    }
  }, [courseId, availableCourses]);

  const loadAvailableCourses = async () => {
    try {
      const courses = await api.getCourses();
      setAvailableCourses(courses);
    } catch (error) {
      console.error('Failed to load courses:', error);
      setToast({ message: 'Failed to load available courses', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!courseId) {
      newErrors.courseId = 'Please select a course';
    }

    if (!year) {
      newErrors.year = 'Please select a year';
    }

    if (!semester) {
      newErrors.semester = 'Please select a semester';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await api.createInstance({
        courseId,
        year: parseInt(year),
        semester: parseInt(semester) as 1 | 2
      });

      setToast({ message: 'Course instance created successfully', type: 'success' });
      setTimeout(() => {
        navigate('/instances');
      }, 1500);
    } catch (error) {
      if (error instanceof ApiError) {
        setToast({ message: error.message, type: 'error' });
      } else {
        setToast({ message: 'Failed to create course instance', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const courseOptions = availableCourses.map(course => ({
    value: course.courseId,
    label: `${course.courseId} - ${course.title}`
  }));

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const yearValue = new Date().getFullYear() + i;
    return { value: yearValue.toString(), label: yearValue.toString() };
  });

  const semesterOptions = [
    { value: '1', label: 'Semester 1 (Spring)' },
    { value: '2', label: 'Semester 2 (Fall)' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl sm:text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-2xl sm:text-3xl font-black text-primary mb-2">Create Course Instance</h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Schedule a course for a specific year and semester
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

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Course"
            value={courseId}
            onChange={setCourseId}
            options={courseOptions}
            placeholder="Select a course"
            required
            error={errors.courseId}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Year"
              value={year}
              onChange={setYear}
              options={yearOptions}
              placeholder="Select year"
              required
              error={errors.year}
            />

            <Select
              label="Semester"
              value={semester}
              onChange={setSemester}
              options={semesterOptions}
              placeholder="Select semester"
              required
              error={errors.semester}
            />
          </div>

          {/* Course Preview */}
          {selectedCourse && (
            <div className="bg-gray-50 p-4 border-2 border-gray-300">
              <h3 className="text-lg font-bold text-primary mb-3">Course Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-bold text-gray-600">Course ID: </span>
                  <span className="font-medium">{selectedCourse.courseId}</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Title: </span>
                  <span className="font-medium">{selectedCourse.title}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-sm font-bold text-gray-600">Description: </span>
                  <span className="font-medium">{selectedCourse.description}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-sm font-bold text-gray-600">Prerequisites: </span>
                  <span className="font-medium">
                    {selectedCourse.prerequisites.length > 0 
                      ? selectedCourse.prerequisites.join(', ') 
                      : 'None'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Preview */}
          {courseId && year && semester && (
            <div className="bg-blue-50 p-4 border-2 border-blue-300">
              <h3 className="text-lg font-bold text-primary mb-3">Schedule Preview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-bold text-gray-600">Course: </span>
                  <span className="font-medium">{courseId}</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Year: </span>
                  <span className="font-medium">{year}</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Semester: </span>
                  <span className="font-medium">
                    {semester === '1' ? 'Semester 1 (Spring)' : 'Semester 2 (Fall)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/instances')}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              icon={Save}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? 'Creating...' : 'Create Instance'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateInstance;