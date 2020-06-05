import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../../model/category';
import { CategoryService } from '../category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { Intent } from '../../intent.enum';

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
  add = Intent.add;
  edit = Intent.edit;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
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

  onEditCategory(action: Intent, category: Category) {
    console.log('edit category');
    this.dialog.open(
      CategoryDialogComponent,
      { height: '350px', width: '400px', data: { action, category }}
    )
  }

}
