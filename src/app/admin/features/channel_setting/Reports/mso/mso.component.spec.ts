import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsoComponent } from './mso.component';

describe('MsoComponent', () => {
  let component: MsoComponent;
  let fixture: ComponentFixture<MsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MsoComponent]
    });
    fixture = TestBed.createComponent(MsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
