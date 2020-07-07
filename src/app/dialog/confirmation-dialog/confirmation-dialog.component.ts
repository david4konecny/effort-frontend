import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  title = 'Are you sure?';
  content = '';
  action = 'Confirm';
  discard = 'Cancel';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { }

  ngOnInit(): void {
    this.loadDialogContent();
  }

  private loadDialogContent() {
    if (this.data.title) {
      this.title = this.data.title;
    }
    if (this.data.content) {
      this.content = this.data.content;
    }
    if (this.data.action) {
      this.action = this.data.action;
    }
    if (this.data.discard) {
      this.discard = this.data.discard;
    }
  }

}
