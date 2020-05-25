import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDialogComponent } from './time-dialog.component';

describe('TimeDialogComponent', () => {
  let component: TimeDialogComponent;
  let fixture: ComponentFixture<TimeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
