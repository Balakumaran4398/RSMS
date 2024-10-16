import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditareaComponent } from './editarea.component';

describe('EditareaComponent', () => {
  let component: EditareaComponent;
  let fixture: ComponentFixture<EditareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditareaComponent]
    });
    fixture = TestBed.createComponent(EditareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
