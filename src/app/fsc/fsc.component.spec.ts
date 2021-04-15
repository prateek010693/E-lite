import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FscComponent } from './fsc.component';

describe('FscComponent', () => {
  let component: FscComponent;
  let fixture: ComponentFixture<FscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FscComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
