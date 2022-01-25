import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OffreCompositionDetailComponent } from './offre-composition-detail.component';

describe('OffreComposition Management Detail Component', () => {
  let comp: OffreCompositionDetailComponent;
  let fixture: ComponentFixture<OffreCompositionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffreCompositionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ offreComposition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OffreCompositionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OffreCompositionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load offreComposition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.offreComposition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
