import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEtapeDefinition, EtapeDefinition } from '../etape-definition.model';

import { EtapeDefinitionService } from './etape-definition.service';

describe('EtapeDefinition Service', () => {
  let service: EtapeDefinitionService;
  let httpMock: HttpTestingController;
  let elemDefault: IEtapeDefinition;
  let expectedResult: IEtapeDefinition | IEtapeDefinition[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EtapeDefinitionService);
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

    it('should create a EtapeDefinition', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EtapeDefinition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EtapeDefinition', () => {
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

    it('should partial update a EtapeDefinition', () => {
      const patchObject = Object.assign(
        {
          label: 'BBBBBB',
        },
        new EtapeDefinition()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EtapeDefinition', () => {
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

    it('should delete a EtapeDefinition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEtapeDefinitionToCollectionIfMissing', () => {
      it('should add a EtapeDefinition to an empty array', () => {
        const etapeDefinition: IEtapeDefinition = { id: 123 };
        expectedResult = service.addEtapeDefinitionToCollectionIfMissing([], etapeDefinition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etapeDefinition);
      });

      it('should not add a EtapeDefinition to an array that contains it', () => {
        const etapeDefinition: IEtapeDefinition = { id: 123 };
        const etapeDefinitionCollection: IEtapeDefinition[] = [
          {
            ...etapeDefinition,
          },
          { id: 456 },
        ];
        expectedResult = service.addEtapeDefinitionToCollectionIfMissing(etapeDefinitionCollection, etapeDefinition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EtapeDefinition to an array that doesn't contain it", () => {
        const etapeDefinition: IEtapeDefinition = { id: 123 };
        const etapeDefinitionCollection: IEtapeDefinition[] = [{ id: 456 }];
        expectedResult = service.addEtapeDefinitionToCollectionIfMissing(etapeDefinitionCollection, etapeDefinition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etapeDefinition);
      });

      it('should add only unique EtapeDefinition to an array', () => {
        const etapeDefinitionArray: IEtapeDefinition[] = [{ id: 123 }, { id: 456 }, { id: 61726 }];
        const etapeDefinitionCollection: IEtapeDefinition[] = [{ id: 123 }];
        expectedResult = service.addEtapeDefinitionToCollectionIfMissing(etapeDefinitionCollection, ...etapeDefinitionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etapeDefinition: IEtapeDefinition = { id: 123 };
        const etapeDefinition2: IEtapeDefinition = { id: 456 };
        expectedResult = service.addEtapeDefinitionToCollectionIfMissing([], etapeDefinition, etapeDefinition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etapeDefinition);
        expect(expectedResult).toContain(etapeDefinition2);
      });

      it('should accept null and undefined values', () => {
        const etapeDefinition: IEtapeDefinition = { id: 123 };
        expectedResult = service.addEtapeDefinitionToCollectionIfMissing([], null, etapeDefinition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etapeDefinition);
      });

      it('should return initial array if no EtapeDefinition is added', () => {
        const etapeDefinitionCollection: IEtapeDefinition[] = [{ id: 123 }];
        expectedResult = service.addEtapeDefinitionToCollectionIfMissing(etapeDefinitionCollection, undefined, null);
        expect(expectedResult).toEqual(etapeDefinitionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
