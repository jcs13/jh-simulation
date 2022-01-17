import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SimulationService } from '../service/simulation.service';

import { SimulationComponent } from './simulation.component';

describe('Simulation Management Component', () => {
  let comp: SimulationComponent;
  let fixture: ComponentFixture<SimulationComponent>;
  let service: SimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SimulationComponent],
    })
      .overrideTemplate(SimulationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SimulationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SimulationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.simulations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
