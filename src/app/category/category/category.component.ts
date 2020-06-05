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

  onEditCategory(category: Category) {
    this.openCategoryDialog(Intent.edit, category);
  }

  onAddNewCategory() {
    const category = { id: 0, name: '', color: '#3700b3'} as Category;
    this.openCategoryDialog(Intent.add, category);
  }

  openCategoryDialog(action: Intent, category: Category) {
    const dialog = this.dialog.open(
      CategoryDialogComponent,
      { height: '350px', width: '400px', data: { action, category }}
    );
    dialog.afterClosed().subscribe(
      result => this.onDialogClosed(action, result)
    );
  }

  onDialogClosed(action: Intent, result: Category) {
    if (result) {
      if (action === Intent.edit) {
        this.editCategory(result);
      }
      else if (action === Intent.add) {
        this.addCategory(result);
      }
    }
  }

  addCategory(category: Category) {
    this.categoryService.add(category).subscribe(
      next => this.categories.push(next)
    );
  }

  editCategory(category: Category) {
    this.categoryService.edit(category).subscribe();
  }

}
