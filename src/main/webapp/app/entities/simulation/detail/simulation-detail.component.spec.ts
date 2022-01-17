import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SimulationDetailComponent } from './simulation-detail.component';

describe('Simulation Management Detail Component', () => {
  let comp: SimulationDetailComponent;
  let fixture: ComponentFixture<SimulationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimulationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ simulation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SimulationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SimulationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load simulation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.simulation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
