import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBlocDefinition, BlocDefinition } from '../bloc-definition.model';

import { BlocDefinitionService } from './bloc-definition.service';

describe('BlocDefinition Service', () => {
  let service: BlocDefinitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IBlocDefinition;
  let expectedResult: IBlocDefinition | IBlocDefinition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlocDefinitionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a BlocDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BlocDefinition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BlocDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should partial update a BlocDefinition', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          label: 'BBBBBB',
        },
        new BlocDefinition()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BlocDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a BlocDefinition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlocDefinitionToCollectionIfMissing', () => {
      it('should add a BlocDefinition to an empty array', () => {
        const blocDefinition: IBlocDefinition = { id: 123 };
        expectedResult = service.addBlocDefinitionToCollectionIfMissing([], blocDefinition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blocDefinition);
      });

      it('should not add a BlocDefinition to an array that contains it', () => {
        const blocDefinition: IBlocDefinition = { id: 123 };
        const blocDefinitionCollection: IBlocDefinition[] = [
          {
            ...blocDefinition,
          },
          { id: 456 },
        ];
        expectedResult = service.addBlocDefinitionToCollectionIfMissing(blocDefinitionCollection, blocDefinition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BlocDefinition to an array that doesn't contain it", () => {
        const blocDefinition: IBlocDefinition = { id: 123 };
        const blocDefinitionCollection: IBlocDefinition[] = [{ id: 456 }];
        expectedResult = service.addBlocDefinitionToCollectionIfMissing(blocDefinitionCollection, blocDefinition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blocDefinition);
      });

      it('should add only unique BlocDefinition to an array', () => {
        const blocDefinitionArray: IBlocDefinition[] = [{ id: 123 }, { id: 456 }, { id: 31495 }];
        const blocDefinitionCollection: IBlocDefinition[] = [{ id: 123 }];
        expectedResult = service.addBlocDefinitionToCollectionIfMissing(blocDefinitionCollection, ...blocDefinitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const blocDefinition: IBlocDefinition = { id: 123 };
        const blocDefinition2: IBlocDefinition = { id: 456 };
        expectedResult = service.addBlocDefinitionToCollectionIfMissing([], blocDefinition, blocDefinition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(blocDefinition);
        expect(expectedResult).toContain(blocDefinition2);
      });

      it('should accept null and undefined values', () => {
        const blocDefinition: IBlocDefinition = { id: 123 };
        expectedResult = service.addBlocDefinitionToCollectionIfMissing([], null, blocDefinition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(blocDefinition);
      });

      it('should return initial array if no BlocDefinition is added', () => {
        const blocDefinitionCollection: IBlocDefinition[] = [{ id: 123 }];
        expectedResult = service.addBlocDefinitionToCollectionIfMissing(blocDefinitionCollection, undefined, null);
        expect(expectedResult).toEqual(blocDefinitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
