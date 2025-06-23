export interface Course {
  courseId: string;
  title: string;
  description: string;
  prerequisites: string[];
}

export interface CourseInstance {
  courseId: string;
  year: number;
  semester: 1 | 2;
  course?: Course;
}

export interface ApiError {
  message: string;
  code: number;
}