import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportIssues } from './support-issues';

describe('SupportIssues', () => {
  let component: SupportIssues;
  let fixture: ComponentFixture<SupportIssues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportIssues],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportIssues);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
