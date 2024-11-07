import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialeditbulkpackageComponent } from './specialeditbulkpackage.component';

describe('SpecialeditbulkpackageComponent', () => {
  let component: SpecialeditbulkpackageComponent;
  let fixture: ComponentFixture<SpecialeditbulkpackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialeditbulkpackageComponent]
    });
    fixture = TestBed.createComponent(SpecialeditbulkpackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
