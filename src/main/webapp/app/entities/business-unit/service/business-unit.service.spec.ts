import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBusinessUnit, BusinessUnit } from '../business-unit.model';

import { BusinessUnitService } from './business-unit.service';

describe('BusinessUnit Service', () => {
  let service: BusinessUnitService;
  let httpMock: HttpTestingController;
  let elemDefault: IBusinessUnit;
  let expectedResult: IBusinessUnit | IBusinessUnit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BusinessUnitService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      name: 'AAAAAAA',
      label: 'AAAAAAA',
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

    it('should create a BusinessUnit', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BusinessUnit()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BusinessUnit', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          name: 'BBBBBB',
          label: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BusinessUnit', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          label: 'BBBBBB',
        },
        new BusinessUnit()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BusinessUnit', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          name: 'BBBBBB',
          label: 'BBBBBB',
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

    it('should delete a BusinessUnit', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBusinessUnitToCollectionIfMissing', () => {
      it('should add a BusinessUnit to an empty array', () => {
        const businessUnit: IBusinessUnit = { id: 123 };
        expectedResult = service.addBusinessUnitToCollectionIfMissing([], businessUnit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessUnit);
      });

      it('should not add a BusinessUnit to an array that contains it', () => {
        const businessUnit: IBusinessUnit = { id: 123 };
        const businessUnitCollection: IBusinessUnit[] = [
          {
            ...businessUnit,
          },
          { id: 456 },
        ];
        expectedResult = service.addBusinessUnitToCollectionIfMissing(businessUnitCollection, businessUnit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BusinessUnit to an array that doesn't contain it", () => {
        const businessUnit: IBusinessUnit = { id: 123 };
        const businessUnitCollection: IBusinessUnit[] = [{ id: 456 }];
        expectedResult = service.addBusinessUnitToCollectionIfMissing(businessUnitCollection, businessUnit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessUnit);
      });

      it('should add only unique BusinessUnit to an array', () => {
        const businessUnitArray: IBusinessUnit[] = [{ id: 123 }, { id: 456 }, { id: 71657 }];
        const businessUnitCollection: IBusinessUnit[] = [{ id: 123 }];
        expectedResult = service.addBusinessUnitToCollectionIfMissing(businessUnitCollection, ...businessUnitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const businessUnit: IBusinessUnit = { id: 123 };
        const businessUnit2: IBusinessUnit = { id: 456 };
        expectedResult = service.addBusinessUnitToCollectionIfMissing([], businessUnit, businessUnit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(businessUnit);
        expect(expectedResult).toContain(businessUnit2);
      });

      it('should accept null and undefined values', () => {
        const businessUnit: IBusinessUnit = { id: 123 };
        expectedResult = service.addBusinessUnitToCollectionIfMissing([], null, businessUnit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(businessUnit);
      });

      it('should return initial array if no BusinessUnit is added', () => {
        const businessUnitCollection: IBusinessUnit[] = [{ id: 123 }];
        expectedResult = service.addBusinessUnitToCollectionIfMissing(businessUnitCollection, undefined, null);
        expect(expectedResult).toEqual(businessUnitCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
