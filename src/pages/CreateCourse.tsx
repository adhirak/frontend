import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Course } from '../types';
import { api, ApiError } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import MultiSelect from '../components/MultiSelect';
import Toast from '../components/Toast';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadAvailableCourses();
  }, []);

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

    if (!courseId.trim()) {
      newErrors.courseId = 'Course ID is required';
    } else if (!/^[A-Z]{2,4}\d{3}$/.test(courseId.toUpperCase())) {
      newErrors.courseId = 'Course ID should be in format like CS101, MATH201';
    }

    if (!title.trim()) {
      newErrors.title = 'Course title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Course description is required';
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
      const newCourse = await api.createCourse({
        courseId: courseId.toUpperCase(),
        title: title.trim(),
        description: description.trim(),
        prerequisites
      });

      setToast({ message: `Course ${newCourse.courseId} created successfully`, type: 'success' });
      setTimeout(() => {
        navigate('/courses');
      }, 1500);
    } catch (error) {
  if (error instanceof ApiError) {
    setToast({ message: error.message, type: 'error' });
  } else {
    setToast({ message: 'Failed to create course', type: 'error' });
  }
}


  };

  const prerequisiteOptions = availableCourses.map(course => ({
    value: course.courseId,
    label: `${course.courseId} - ${course.title}`
  }));

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
          <h1 className="text-2xl sm:text-3xl font-black text-primary mb-2">Create New Course</h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Add a new course with prerequisites validation
          </p>
        </div>
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/courses')}
          className="w-full sm:w-auto"
        >
          Back to Courses
        </Button>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="Course ID"
              value={courseId}
              onChange={setCourseId}
              placeholder="e.g., CS101, MATH201"
              required
              error={errors.courseId}
            />

            <Input
              label="Course Title"
              value={title}
              onChange={setTitle}
              placeholder="e.g., Introduction to Computer Science"
              required
              error={errors.title}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-primary mb-2">
              Course Description
              <span className="text-error ml-1">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the course content and objectives..."
              required
              rows={4}
              className={`
                w-full px-4 py-3 border-2 border-black rounded-none font-medium resize-none
                focus:outline-none focus:ring-0 focus:border-accent
                ${errors.description ? 'border-error bg-red-50' : 'bg-white'}
                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              `}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-error font-medium">{errors.description}</p>
            )}
          </div>

          <MultiSelect
            label="Prerequisites"
            selectedValues={prerequisites}
            onChange={setPrerequisites}
            options={prerequisiteOptions}
            placeholder="Select prerequisite courses (optional)"
          />

          {/* Preview */}
          {(courseId || title || description || prerequisites.length > 0) && (
            <div className="bg-gray-50 p-4 border-2 border-gray-300">
              <h3 className="text-lg font-bold text-primary mb-3">Preview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-bold text-gray-600">Course ID: </span>
                  <span className="font-medium">{courseId.toUpperCase() || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-600">Title: </span>
                  <span className="font-medium">{title || 'Not set'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-sm font-bold text-gray-600">Description: </span>
                  <span className="font-medium">{description || 'Not set'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-sm font-bold text-gray-600">Prerequisites: </span>
                  <span className="font-medium">
                    {prerequisites.length > 0 ? prerequisites.join(', ') : 'None'}
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
              onClick={() => navigate('/courses')}
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
              {submitting ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateCourse;