import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLcoComponent } from './update-lco.component';

describe('UpdateLcoComponent', () => {
  let component: UpdateLcoComponent;
  let fixture: ComponentFixture<UpdateLcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateLcoComponent]
    });
    fixture = TestBed.createComponent(UpdateLcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
