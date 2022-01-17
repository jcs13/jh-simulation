import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParcoursDefinition, ParcoursDefinition } from '../parcours-definition.model';

import { ParcoursDefinitionService } from './parcours-definition.service';

describe('ParcoursDefinition Service', () => {
  let service: ParcoursDefinitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IParcoursDefinition;
  let expectedResult: IParcoursDefinition | IParcoursDefinition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParcoursDefinitionService);
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

    it('should create a ParcoursDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ParcoursDefinition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParcoursDefinition', () => {
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

    it('should partial update a ParcoursDefinition', () => {
      const patchObject = Object.assign({}, new ParcoursDefinition());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ParcoursDefinition', () => {
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

    it('should delete a ParcoursDefinition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParcoursDefinitionToCollectionIfMissing', () => {
      it('should add a ParcoursDefinition to an empty array', () => {
        const parcoursDefinition: IParcoursDefinition = { id: 123 };
        expectedResult = service.addParcoursDefinitionToCollectionIfMissing([], parcoursDefinition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parcoursDefinition);
      });

      it('should not add a ParcoursDefinition to an array that contains it', () => {
        const parcoursDefinition: IParcoursDefinition = { id: 123 };
        const parcoursDefinitionCollection: IParcoursDefinition[] = [
          {
            ...parcoursDefinition,
          },
          { id: 456 },
        ];
        expectedResult = service.addParcoursDefinitionToCollectionIfMissing(parcoursDefinitionCollection, parcoursDefinition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParcoursDefinition to an array that doesn't contain it", () => {
        const parcoursDefinition: IParcoursDefinition = { id: 123 };
        const parcoursDefinitionCollection: IParcoursDefinition[] = [{ id: 456 }];
        expectedResult = service.addParcoursDefinitionToCollectionIfMissing(parcoursDefinitionCollection, parcoursDefinition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parcoursDefinition);
      });

      it('should add only unique ParcoursDefinition to an array', () => {
        const parcoursDefinitionArray: IParcoursDefinition[] = [{ id: 123 }, { id: 456 }, { id: 66527 }];
        const parcoursDefinitionCollection: IParcoursDefinition[] = [{ id: 123 }];
        expectedResult = service.addParcoursDefinitionToCollectionIfMissing(parcoursDefinitionCollection, ...parcoursDefinitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parcoursDefinition: IParcoursDefinition = { id: 123 };
        const parcoursDefinition2: IParcoursDefinition = { id: 456 };
        expectedResult = service.addParcoursDefinitionToCollectionIfMissing([], parcoursDefinition, parcoursDefinition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parcoursDefinition);
        expect(expectedResult).toContain(parcoursDefinition2);
      });

      it('should accept null and undefined values', () => {
        const parcoursDefinition: IParcoursDefinition = { id: 123 };
        expectedResult = service.addParcoursDefinitionToCollectionIfMissing([], null, parcoursDefinition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parcoursDefinition);
      });

      it('should return initial array if no ParcoursDefinition is added', () => {
        const parcoursDefinitionCollection: IParcoursDefinition[] = [{ id: 123 }];
        expectedResult = service.addParcoursDefinitionToCollectionIfMissing(parcoursDefinitionCollection, undefined, null);
        expect(expectedResult).toEqual(parcoursDefinitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
