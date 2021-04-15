import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssestInstallComponent } from './assest-install.component';

describe('AssestInstallComponent', () => {
  let component: AssestInstallComponent;
  let fixture: ComponentFixture<AssestInstallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssestInstallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssestInstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
