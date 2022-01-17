import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EtapeService } from '../service/etape.service';

import { EtapeComponent } from './etape.component';

describe('Etape Management Component', () => {
  let comp: EtapeComponent;
  let fixture: ComponentFixture<EtapeComponent>;
  let service: EtapeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EtapeComponent],
    })
      .overrideTemplate(EtapeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtapeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EtapeService);

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
    expect(comp.etapes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
