import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Portfoliocomponent } from './portfoliocomponent';

describe('Portfoliocomponent', () => {
  let component: Portfoliocomponent;
  let fixture: ComponentFixture<Portfoliocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Portfoliocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Portfoliocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
