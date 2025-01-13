import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipidModelComponent } from './chipid-model.component';

describe('ChipidModelComponent', () => {
  let component: ChipidModelComponent;
  let fixture: ComponentFixture<ChipidModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChipidModelComponent]
    });
    fixture = TestBed.createComponent(ChipidModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
