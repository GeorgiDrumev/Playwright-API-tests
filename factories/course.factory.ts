import { faker } from '@faker-js/faker';
import type { CreateCourseRequest, UpdateCourseRequest } from '@dtos/course.dto';

const COURSE_CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Data Science',
  'Marketing',
] as const;
const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export class CourseFactory {
  static build(overrides: Partial<CreateCourseRequest> = {}): CreateCourseRequest {
    const now = new Date().toISOString();
    return {
      title: faker.lorem.words(4),
      description: faker.lorem.paragraph(),
      category: faker.helpers.arrayElement(COURSE_CATEGORIES),
      level: faker.helpers.arrayElement(COURSE_LEVELS),
      teacherId: faker.number.int({ min: 1, max: 100 }),
      price: parseFloat(faker.commerce.price({ min: 0, max: 500 })),
      durationHours: faker.number.int({ min: 1, max: 80 }),
      rating: parseFloat(faker.number.float({ min: 1, max: 5, fractionDigits: 1 }).toFixed(1)),
      enrollmentCount: faker.number.int({ min: 0, max: 5000 }),
      thumbnailUrl: faker.image.url(),
      isPublished: faker.datatype.boolean(),
      createdAt: now,
      updatedAt: now,
      ...overrides,
    };
  }

  static buildMany(
    count: number,
    overrides: Partial<CreateCourseRequest> = {},
  ): CreateCourseRequest[] {
    return Array.from({ length: count }, () => CourseFactory.build(overrides));
  }

  static published(overrides: Partial<CreateCourseRequest> = {}): CreateCourseRequest {
    return CourseFactory.build({ isPublished: true, ...overrides });
  }

  static free(overrides: Partial<CreateCourseRequest> = {}): CreateCourseRequest {
    return CourseFactory.build({ price: 0, ...overrides });
  }

  static buildUpdate(overrides: Partial<UpdateCourseRequest> = {}): UpdateCourseRequest {
    return {
      title: faker.lorem.words(4),
      description: faker.lorem.paragraph(),
      ...overrides,
    };
  }
}
