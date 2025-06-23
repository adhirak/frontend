-- Insert sample courses
INSERT INTO courses (course_id, title, description) VALUES 
('CS101', 'Introduction to Computer Science', 'Basic concepts of programming and computer science fundamentals.'),
('CS201', 'Data Structures', 'Learn about arrays, linked lists, trees, and other data structures.'),
('CS301', 'Algorithms', 'Advanced algorithmic concepts and complexity analysis.'),
('MATH101', 'Calculus I', 'Introduction to differential and integral calculus.');

-- Insert prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_id) VALUES 
('CS201', 'CS101'),
('CS301', 'CS201');

-- Insert sample course instances
INSERT INTO course_instances (course_id, year, semester) VALUES 
('CS101', 2025, 1),
('CS201', 2025, 1),
('CS301', 2025, 2),
('MATH101', 2025, 1);