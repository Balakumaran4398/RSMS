import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageBasedComponent } from './package-based.component';

describe('PackageBasedComponent', () => {
  let component: PackageBasedComponent;
  let fixture: ComponentFixture<PackageBasedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackageBasedComponent]
    });
    fixture = TestBed.createComponent(PackageBasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
