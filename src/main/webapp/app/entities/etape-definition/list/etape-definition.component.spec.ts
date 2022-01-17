import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EtapeDefinitionService } from '../service/etape-definition.service';

import { EtapeDefinitionComponent } from './etape-definition.component';

describe('EtapeDefinition Management Component', () => {
  let comp: EtapeDefinitionComponent;
  let fixture: ComponentFixture<EtapeDefinitionComponent>;
  let service: EtapeDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EtapeDefinitionComponent],
    })
      .overrideTemplate(EtapeDefinitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtapeDefinitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EtapeDefinitionService);

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
    expect(comp.etapeDefinitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
