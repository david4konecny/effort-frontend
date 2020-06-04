import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Category } from '../../model/category';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: Category[];
  @Input()
  selectedCategory: Category;
  @Output()
  categoryChange = new EventEmitter<Category>();

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(
      next => {
        this.categories = next;
      }
    );
  }

  onSelectCategory(category: Category) {
    this.selectedCategory = category;
    this.categoryChange.emit(category);
  }

  onEditCategory(category: Category) {
    console.log('edit category');
  }

}
