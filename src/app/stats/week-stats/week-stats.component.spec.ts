import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekStatsComponent } from './week-stats.component';

describe('WeekStatsComponent', () => {
  let component: WeekStatsComponent;
  let fixture: ComponentFixture<WeekStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
