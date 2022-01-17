import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OffreDetailComponent } from './offre-detail.component';

describe('Offre Management Detail Component', () => {
  let comp: OffreDetailComponent;
  let fixture: ComponentFixture<OffreDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffreDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ offre: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OffreDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OffreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load offre on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.offre).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
