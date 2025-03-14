import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcodiscountComponent } from './lcodiscount.component';

describe('LcodiscountComponent', () => {
  let component: LcodiscountComponent;
  let fixture: ComponentFixture<LcodiscountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LcodiscountComponent]
    });
    fixture = TestBed.createComponent(LcodiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
