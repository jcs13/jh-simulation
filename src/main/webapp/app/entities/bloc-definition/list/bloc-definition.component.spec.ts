import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BlocDefinitionService } from '../service/bloc-definition.service';

import { BlocDefinitionComponent } from './bloc-definition.component';

describe('BlocDefinition Management Component', () => {
  let comp: BlocDefinitionComponent;
  let fixture: ComponentFixture<BlocDefinitionComponent>;
  let service: BlocDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BlocDefinitionComponent],
    })
      .overrideTemplate(BlocDefinitionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlocDefinitionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BlocDefinitionService);

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
    expect(comp.blocDefinitions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
