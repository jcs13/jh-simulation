import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBloc, Bloc } from '../bloc.model';

import { BlocService } from './bloc.service';

describe('Bloc Service', () => {
  let service: BlocService;
  let httpMock: HttpTestingController;
  let elemDefault: IBloc;
  let expectedResult: IBloc | IBloc[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BlocService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      label: 'AAAAAAA',
      elementName: 'AAAAAAA',
      elementPath: 'AAAAAAA',
      etapeDefinitionId: 'AAAAAAA',
      blocDefinitionId: 'AAAAAAA',
      display: false,
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

    it('should create a Bloc', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Bloc()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bloc', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
          elementName: 'BBBBBB',
          elementPath: 'BBBBBB',
          etapeDefinitionId: 'BBBBBB',
          blocDefinitionId: 'BBBBBB',
          display: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bloc', () => {
      const patchObject = Object.assign(
        {
          label: 'BBBBBB',
          elementName: 'BBBBBB',
          elementPath: 'BBBBBB',
          blocDefinitionId: 'BBBBBB',
        },
        new Bloc()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bloc', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          label: 'BBBBBB',
          elementName: 'BBBBBB',
          elementPath: 'BBBBBB',
          etapeDefinitionId: 'BBBBBB',
          blocDefinitionId: 'BBBBBB',
          display: true,
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

    it('should delete a Bloc', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBlocToCollectionIfMissing', () => {
      it('should add a Bloc to an empty array', () => {
        const bloc: IBloc = { id: 123 };
        expectedResult = service.addBlocToCollectionIfMissing([], bloc);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bloc);
      });

      it('should not add a Bloc to an array that contains it', () => {
        const bloc: IBloc = { id: 123 };
        const blocCollection: IBloc[] = [
          {
            ...bloc,
          },
          { id: 456 },
        ];
        expectedResult = service.addBlocToCollectionIfMissing(blocCollection, bloc);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bloc to an array that doesn't contain it", () => {
        const bloc: IBloc = { id: 123 };
        const blocCollection: IBloc[] = [{ id: 456 }];
        expectedResult = service.addBlocToCollectionIfMissing(blocCollection, bloc);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bloc);
      });

      it('should add only unique Bloc to an array', () => {
        const blocArray: IBloc[] = [{ id: 123 }, { id: 456 }, { id: 8401 }];
        const blocCollection: IBloc[] = [{ id: 123 }];
        expectedResult = service.addBlocToCollectionIfMissing(blocCollection, ...blocArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bloc: IBloc = { id: 123 };
        const bloc2: IBloc = { id: 456 };
        expectedResult = service.addBlocToCollectionIfMissing([], bloc, bloc2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bloc);
        expect(expectedResult).toContain(bloc2);
      });

      it('should accept null and undefined values', () => {
        const bloc: IBloc = { id: 123 };
        expectedResult = service.addBlocToCollectionIfMissing([], null, bloc, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bloc);
      });

      it('should return initial array if no Bloc is added', () => {
        const blocCollection: IBloc[] = [{ id: 123 }];
        expectedResult = service.addBlocToCollectionIfMissing(blocCollection, undefined, null);
        expect(expectedResult).toEqual(blocCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
