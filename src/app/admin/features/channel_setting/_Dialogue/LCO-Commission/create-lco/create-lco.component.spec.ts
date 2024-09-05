import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLcoComponent } from './create-lco.component';

describe('CreateLcoComponent', () => {
  let component: CreateLcoComponent;
  let fixture: ComponentFixture<CreateLcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLcoComponent]
    });
    fixture = TestBed.createComponent(CreateLcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
