import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EtapeTransitionDetailComponent } from './etape-transition-detail.component';

describe('EtapeTransition Management Detail Component', () => {
  let comp: EtapeTransitionDetailComponent;
  let fixture: ComponentFixture<EtapeTransitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtapeTransitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ etapeTransition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EtapeTransitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EtapeTransitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load etapeTransition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.etapeTransition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
