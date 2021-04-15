import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlbComponent } from './flb.component';

describe('FlbComponent', () => {
  let component: FlbComponent;
  let fixture: ComponentFixture<FlbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
