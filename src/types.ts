export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  completed?: boolean;
  videoUrl?: string;
  content?: string;
  quizQuestions?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  duration: string;
  lessonsCount: number;
  image: string;
  instructor: Instructor;
  outcomes: string[];
  modules: CourseModule[];
  badge?: string;
}

export interface UserEnrollment {
  courseId: string;
  unlockedAt: string;
  completedLessons: string[]; // List of completed lesson IDs
  progress: number; // percentage
  lastActiveLessonId?: string;
}

export interface StripeTransaction {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
  cardBrand?: string;
  last4?: string;
  mode: 'real' | 'sandbox';
}

export interface User {
  id: string;
  name: string;
  email: string;
  registeredCourseIds: string[];
  verified: boolean;
  verificationCode?: string;
}

