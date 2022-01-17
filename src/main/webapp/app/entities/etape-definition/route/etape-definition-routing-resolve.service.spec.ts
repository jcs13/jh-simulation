import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEtapeDefinition, EtapeDefinition } from '../etape-definition.model';
import { EtapeDefinitionService } from '../service/etape-definition.service';

import { EtapeDefinitionRoutingResolveService } from './etape-definition-routing-resolve.service';

describe('EtapeDefinition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EtapeDefinitionRoutingResolveService;
  let service: EtapeDefinitionService;
  let resultEtapeDefinition: IEtapeDefinition | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(EtapeDefinitionRoutingResolveService);
    service = TestBed.inject(EtapeDefinitionService);
    resultEtapeDefinition = undefined;
  });

  describe('resolve', () => {
    it('should return IEtapeDefinition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeDefinition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtapeDefinition).toEqual({ id: 123 });
    });

    it('should return new IEtapeDefinition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeDefinition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEtapeDefinition).toEqual(new EtapeDefinition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as EtapeDefinition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEtapeDefinition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEtapeDefinition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
