import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnagreportingComponent } from './snagreporting.component';

describe('SnagreportingComponent', () => {
  let component: SnagreportingComponent;
  let fixture: ComponentFixture<SnagreportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnagreportingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnagreportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
