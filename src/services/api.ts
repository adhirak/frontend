import { Course, CourseInstance } from '../types';

// Backend API configuration
const API_BASE_URL = 'http://localhost:8080/api';

export class ApiError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
    throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status);
  }
  
  // Handle empty responses (like DELETE operations)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
};

export const api = {
  // Course operations
  async createCourse(course: Omit<Course, 'courseId'> & { courseId: string }): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    
    return handleResponse(response);
  },

  async getCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE_URL}/courses`);
    return handleResponse(response);
  },

  async getCourse(courseId: string): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    return handleResponse(response);
  },

  async deleteCourse(courseId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'DELETE',
    });
    
    await handleResponse(response);
  },

  // Course instance operations
  async createInstance(instance: CourseInstance): Promise<CourseInstance> {
    const response = await fetch(`${API_BASE_URL}/instances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(instance),
    });
    
    return handleResponse(response);
  },

  async getInstances(year?: number, semester?: number): Promise<CourseInstance[]> {
    let url = `${API_BASE_URL}/instances`;
    const params = new URLSearchParams();
    
    if (year) params.append('year', year.toString());
    if (semester) params.append('semester', semester.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    return handleResponse(response);
  },

  async getInstance(year: number, semester: number, courseId: string): Promise<CourseInstance> {
    const response = await fetch(`${API_BASE_URL}/instances/${year}/${semester}/${courseId}`);
    return handleResponse(response);
  },

  async deleteInstance(year: number, semester: number, courseId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/instances/${year}/${semester}/${courseId}`, {
      method: 'DELETE',
    });
    
    await handleResponse(response);
  }
};