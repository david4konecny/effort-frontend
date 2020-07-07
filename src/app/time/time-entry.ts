import { Category } from '../category/category';

export interface TimeEntry {
  id: number;
  date: string;
  category: Category;
  startTime: number;
  endTime: number;
  duration: number;
}
