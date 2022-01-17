import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBlocTransition, BlocTransition } from '../bloc-transition.model';
import { BlocTransitionService } from '../service/bloc-transition.service';

import { BlocTransitionRoutingResolveService } from './bloc-transition-routing-resolve.service';

describe('BlocTransition routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BlocTransitionRoutingResolveService;
  let service: BlocTransitionService;
  let resultBlocTransition: IBlocTransition | undefined;

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
    routingResolveService = TestBed.inject(BlocTransitionRoutingResolveService);
    service = TestBed.inject(BlocTransitionService);
    resultBlocTransition = undefined;
  });

  describe('resolve', () => {
    it('should return IBlocTransition returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlocTransition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBlocTransition).toEqual({ id: 123 });
    });

    it('should return new IBlocTransition if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlocTransition = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBlocTransition).toEqual(new BlocTransition());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BlocTransition })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBlocTransition = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBlocTransition).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
