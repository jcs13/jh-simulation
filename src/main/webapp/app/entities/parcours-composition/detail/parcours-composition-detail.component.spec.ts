import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoursCompositionDetailComponent } from './parcours-composition-detail.component';

describe('ParcoursComposition Management Detail Component', () => {
  let comp: ParcoursCompositionDetailComponent;
  let fixture: ComponentFixture<ParcoursCompositionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcoursCompositionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parcoursComposition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParcoursCompositionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParcoursCompositionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parcoursComposition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parcoursComposition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
