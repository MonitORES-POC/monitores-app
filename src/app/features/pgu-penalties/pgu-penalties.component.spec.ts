import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PguPenaltiesComponent } from './pgu-penalties.component';

describe('PguPenaltiesComponent', () => {
  let component: PguPenaltiesComponent;
  let fixture: ComponentFixture<PguPenaltiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PguPenaltiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PguPenaltiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
