import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComplianceComponent } from './task-compliance.component';

describe('TaskComplianceComponent', () => {
  let component: TaskComplianceComponent;
  let fixture: ComponentFixture<TaskComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
