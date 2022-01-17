import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EtapeDetailComponent } from './etape-detail.component';

describe('Etape Management Detail Component', () => {
  let comp: EtapeDetailComponent;
  let fixture: ComponentFixture<EtapeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtapeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ etape: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EtapeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EtapeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load etape on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.etape).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
