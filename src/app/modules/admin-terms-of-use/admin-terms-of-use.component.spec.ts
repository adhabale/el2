import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermsOfUseComponent } from './admin-terms-of-use.component';

describe('TermsOfUseComponent', () => {
  let component: AdminTermsOfUseComponent;
  let fixture: ComponentFixture<AdminTermsOfUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTermsOfUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermsOfUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
