import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inquiry } from './inquiry';

describe('Inquiry', () => {
  let component: Inquiry;
  let fixture: ComponentFixture<Inquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inquiry],
    }).compileComponents();

    fixture = TestBed.createComponent(Inquiry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
