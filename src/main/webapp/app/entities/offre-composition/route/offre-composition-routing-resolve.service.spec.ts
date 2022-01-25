import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IOffreComposition, OffreComposition } from '../offre-composition.model';
import { OffreCompositionService } from '../service/offre-composition.service';

import { OffreCompositionRoutingResolveService } from './offre-composition-routing-resolve.service';

describe('OffreComposition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OffreCompositionRoutingResolveService;
  let service: OffreCompositionService;
  let resultOffreComposition: IOffreComposition | undefined;

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
    routingResolveService = TestBed.inject(OffreCompositionRoutingResolveService);
    service = TestBed.inject(OffreCompositionService);
    resultOffreComposition = undefined;
  });

  describe('resolve', () => {
    it('should return IOffreComposition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOffreComposition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOffreComposition).toEqual({ id: 123 });
    });

    it('should return new IOffreComposition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOffreComposition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOffreComposition).toEqual(new OffreComposition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as OffreComposition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOffreComposition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOffreComposition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
