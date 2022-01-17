import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BlocTransitionService } from '../service/bloc-transition.service';

import { BlocTransitionComponent } from './bloc-transition.component';

describe('BlocTransition Management Component', () => {
  let comp: BlocTransitionComponent;
  let fixture: ComponentFixture<BlocTransitionComponent>;
  let service: BlocTransitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BlocTransitionComponent],
    })
      .overrideTemplate(BlocTransitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlocTransitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BlocTransitionService);

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
    expect(comp.blocTransitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
