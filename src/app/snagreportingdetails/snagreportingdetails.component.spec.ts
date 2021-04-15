import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnagreportingdetailsComponent } from './snagreportingdetails.component';

describe('SnagreportingdetailsComponent', () => {
  let component: SnagreportingdetailsComponent;
  let fixture: ComponentFixture<SnagreportingdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnagreportingdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnagreportingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
