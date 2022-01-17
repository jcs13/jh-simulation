import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EtapeDefinitionDetailComponent } from './etape-definition-detail.component';

describe('EtapeDefinition Management Detail Component', () => {
  let comp: EtapeDefinitionDetailComponent;
  let fixture: ComponentFixture<EtapeDefinitionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtapeDefinitionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ etapeDefinition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EtapeDefinitionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EtapeDefinitionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load etapeDefinition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.etapeDefinition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
