import {Category} from './category';

export interface TimeSession {
  id: number;
  date: string;
  category: Category;
  startTime: number;
  endTime: number;
  duration: number;
}
