import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ParcoursDefinitionService } from '../service/parcours-definition.service';

import { ParcoursDefinitionComponent } from './parcours-definition.component';

describe('ParcoursDefinition Management Component', () => {
  let comp: ParcoursDefinitionComponent;
  let fixture: ComponentFixture<ParcoursDefinitionComponent>;
  let service: ParcoursDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ParcoursDefinitionComponent],
    })
      .overrideTemplate(ParcoursDefinitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParcoursDefinitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParcoursDefinitionService);

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
    expect(comp.parcoursDefinitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
