import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from '../category';
import { CategoryService } from '../service/category.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { Intent } from '../../intent.enum';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';

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

  onDeleteCategory(category: Category) {
    const dialog = this.openConfirmationDialog();
    dialog.afterClosed().subscribe(
      result => {
        if (result) {
          this.deleteCategory(category);
        }
      }
    );
  }

  private openConfirmationDialog(): MatDialogRef<ConfirmationDialogComponent, any> {
    return this.dialog.open(
      ConfirmationDialogComponent,
      { height: '200px', width: '400px',
        data: {
          title: 'Delete category?',
          content: 'This will delete all time entries for this category.'
        }
      }
    );
  }

  getStyleObject(color: string) {
    return {
      'border-color': color,
      'background-color': this.getColorTransparant(color)
    }
  }

  private getColorTransparant(hex: string): string {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }

  private deleteCategory(category: Category) {
    this.categoryService.deleteById(category.id).subscribe(
      next => this.removeDeletedCategoryFromList(category)
    );
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

  removeDeletedCategoryFromList(category: Category) {
    const idx = this.categories.findIndex(it => category === it);
    this.categories.splice(idx, 1);
  }

}
