import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PguConstraintComponent } from './pgu-constraint.component';

describe('PguConstraintComponent', () => {
  let component: PguConstraintComponent;
  let fixture: ComponentFixture<PguConstraintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PguConstraintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PguConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
