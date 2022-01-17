import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EtapeTransitionService } from '../service/etape-transition.service';

import { EtapeTransitionComponent } from './etape-transition.component';

describe('EtapeTransition Management Component', () => {
  let comp: EtapeTransitionComponent;
  let fixture: ComponentFixture<EtapeTransitionComponent>;
  let service: EtapeTransitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EtapeTransitionComponent],
    })
      .overrideTemplate(EtapeTransitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtapeTransitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EtapeTransitionService);

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
    expect(comp.etapeTransitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
