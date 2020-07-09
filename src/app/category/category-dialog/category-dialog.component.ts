import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../category';
import { Intent } from '../../intent.enum';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {
  form: FormGroup;
  private category: Category;
  colors = new Array<string>();
  displayColorOptions = false;
  selectedColor: string;
  add = Intent.add;
  edit = Intent.edit;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CategoryDialogComponent>
  ) { }

  ngOnInit(): void {
    this.loadColorOptions();
    this.category = this.data.category;
    this.selectedColor = this.category.color;
    this.setupForm();
  }

  private setupForm() {
    this.form = this.formBuilder.group({
      name: [this.category.name, [Validators.required, Validators.pattern('[a-zA-Z0-9]{1,14}')]],
      color: [this.category.color, Validators.required]
    });
  }

  onSubmit() {
    const result = this.category;
    result.name = this.form.value.name;
    result.color = this.selectedColor;
    this.dialogRef.close(result);
  }

  onDisplayColorOptions() {
    this.displayColorOptions = !this.displayColorOptions;
  }

  onSelectColor(color: string) {
    this.selectedColor = color;
  }

  loadColorOptions() {
    this.colors.push(
      '#a64ea6',
      '#3700b3',
      '#03dac5',
      '#00897b',
      '#cddc39',
      '#b00020',
    );
  }

}
