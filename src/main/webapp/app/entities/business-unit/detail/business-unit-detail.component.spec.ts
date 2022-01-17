import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BusinessUnitDetailComponent } from './business-unit-detail.component';

describe('BusinessUnit Management Detail Component', () => {
  let comp: BusinessUnitDetailComponent;
  let fixture: ComponentFixture<BusinessUnitDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessUnitDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ businessUnit: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BusinessUnitDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BusinessUnitDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load businessUnit on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.businessUnit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
