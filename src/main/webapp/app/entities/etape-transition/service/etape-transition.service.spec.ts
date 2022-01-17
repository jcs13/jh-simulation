import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEtapeTransition, EtapeTransition } from '../etape-transition.model';

import { EtapeTransitionService } from './etape-transition.service';

describe('EtapeTransition Service', () => {
  let service: EtapeTransitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IEtapeTransition;
  let expectedResult: IEtapeTransition | IEtapeTransition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EtapeTransitionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      transition: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a EtapeTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EtapeTransition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EtapeTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transition: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EtapeTransition', () => {
      const patchObject = Object.assign(
        {
          transition: 1,
        },
        new EtapeTransition()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EtapeTransition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          transition: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a EtapeTransition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEtapeTransitionToCollectionIfMissing', () => {
      it('should add a EtapeTransition to an empty array', () => {
        const etapeTransition: IEtapeTransition = { id: 123 };
        expectedResult = service.addEtapeTransitionToCollectionIfMissing([], etapeTransition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etapeTransition);
      });

      it('should not add a EtapeTransition to an array that contains it', () => {
        const etapeTransition: IEtapeTransition = { id: 123 };
        const etapeTransitionCollection: IEtapeTransition[] = [
          {
            ...etapeTransition,
          },
          { id: 456 },
        ];
        expectedResult = service.addEtapeTransitionToCollectionIfMissing(etapeTransitionCollection, etapeTransition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EtapeTransition to an array that doesn't contain it", () => {
        const etapeTransition: IEtapeTransition = { id: 123 };
        const etapeTransitionCollection: IEtapeTransition[] = [{ id: 456 }];
        expectedResult = service.addEtapeTransitionToCollectionIfMissing(etapeTransitionCollection, etapeTransition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etapeTransition);
      });

      it('should add only unique EtapeTransition to an array', () => {
        const etapeTransitionArray: IEtapeTransition[] = [{ id: 123 }, { id: 456 }, { id: 4062 }];
        const etapeTransitionCollection: IEtapeTransition[] = [{ id: 123 }];
        expectedResult = service.addEtapeTransitionToCollectionIfMissing(etapeTransitionCollection, ...etapeTransitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etapeTransition: IEtapeTransition = { id: 123 };
        const etapeTransition2: IEtapeTransition = { id: 456 };
        expectedResult = service.addEtapeTransitionToCollectionIfMissing([], etapeTransition, etapeTransition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etapeTransition);
        expect(expectedResult).toContain(etapeTransition2);
      });

      it('should accept null and undefined values', () => {
        const etapeTransition: IEtapeTransition = { id: 123 };
        expectedResult = service.addEtapeTransitionToCollectionIfMissing([], null, etapeTransition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etapeTransition);
      });

      it('should return initial array if no EtapeTransition is added', () => {
        const etapeTransitionCollection: IEtapeTransition[] = [{ id: 123 }];
        expectedResult = service.addEtapeTransitionToCollectionIfMissing(etapeTransitionCollection, undefined, null);
        expect(expectedResult).toEqual(etapeTransitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
