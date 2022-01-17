import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusinessUnit, getBusinessUnitIdentifier } from '../business-unit.model';

export type EntityResponseType = HttpResponse<IBusinessUnit>;
export type EntityArrayResponseType = HttpResponse<IBusinessUnit[]>;

@Injectable({ providedIn: 'root' })
export class BusinessUnitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/business-units');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(businessUnit: IBusinessUnit): Observable<EntityResponseType> {
    return this.http.post<IBusinessUnit>(this.resourceUrl, businessUnit, { observe: 'response' });
  }

  update(businessUnit: IBusinessUnit): Observable<EntityResponseType> {
    return this.http.put<IBusinessUnit>(`${this.resourceUrl}/${getBusinessUnitIdentifier(businessUnit) as number}`, businessUnit, {
      observe: 'response',
    });
  }

  partialUpdate(businessUnit: IBusinessUnit): Observable<EntityResponseType> {
    return this.http.patch<IBusinessUnit>(`${this.resourceUrl}/${getBusinessUnitIdentifier(businessUnit) as number}`, businessUnit, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBusinessUnit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBusinessUnit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBusinessUnitToCollectionIfMissing(
    businessUnitCollection: IBusinessUnit[],
    ...businessUnitsToCheck: (IBusinessUnit | null | undefined)[]
  ): IBusinessUnit[] {
    const businessUnits: IBusinessUnit[] = businessUnitsToCheck.filter(isPresent);
    if (businessUnits.length > 0) {
      const businessUnitCollectionIdentifiers = businessUnitCollection.map(
        businessUnitItem => getBusinessUnitIdentifier(businessUnitItem)!
      );
      const businessUnitsToAdd = businessUnits.filter(businessUnitItem => {
        const businessUnitIdentifier = getBusinessUnitIdentifier(businessUnitItem);
        if (businessUnitIdentifier == null || businessUnitCollectionIdentifiers.includes(businessUnitIdentifier)) {
          return false;
        }
        businessUnitCollectionIdentifiers.push(businessUnitIdentifier);
        return true;
      });
      return [...businessUnitsToAdd, ...businessUnitCollection];
    }
    return businessUnitCollection;
  }
}
