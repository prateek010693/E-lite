import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderdetailsComponent } from './workorderdetails.component';

describe('WorkorderdetailsComponent', () => {
  let component: WorkorderdetailsComponent;
  let fixture: ComponentFixture<WorkorderdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkorderdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
