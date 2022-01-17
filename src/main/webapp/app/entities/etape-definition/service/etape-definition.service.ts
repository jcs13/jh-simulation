import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtapeDefinition, getEtapeDefinitionIdentifier } from '../etape-definition.model';

export type EntityResponseType = HttpResponse<IEtapeDefinition>;
export type EntityArrayResponseType = HttpResponse<IEtapeDefinition[]>;

@Injectable({ providedIn: 'root' })
export class EtapeDefinitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etape-definitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(etapeDefinition: IEtapeDefinition): Observable<EntityResponseType> {
    return this.http.post<IEtapeDefinition>(this.resourceUrl, etapeDefinition, { observe: 'response' });
  }

  update(etapeDefinition: IEtapeDefinition): Observable<EntityResponseType> {
    return this.http.put<IEtapeDefinition>(
      `${this.resourceUrl}/${getEtapeDefinitionIdentifier(etapeDefinition) as number}`,
      etapeDefinition,
      { observe: 'response' }
    );
  }

  partialUpdate(etapeDefinition: IEtapeDefinition): Observable<EntityResponseType> {
    return this.http.patch<IEtapeDefinition>(
      `${this.resourceUrl}/${getEtapeDefinitionIdentifier(etapeDefinition) as number}`,
      etapeDefinition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtapeDefinition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtapeDefinition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEtapeDefinitionToCollectionIfMissing(
    etapeDefinitionCollection: IEtapeDefinition[],
    ...etapeDefinitionsToCheck: (IEtapeDefinition | null | undefined)[]
  ): IEtapeDefinition[] {
    const etapeDefinitions: IEtapeDefinition[] = etapeDefinitionsToCheck.filter(isPresent);
    if (etapeDefinitions.length > 0) {
      const etapeDefinitionCollectionIdentifiers = etapeDefinitionCollection.map(
        etapeDefinitionItem => getEtapeDefinitionIdentifier(etapeDefinitionItem)!
      );
      const etapeDefinitionsToAdd = etapeDefinitions.filter(etapeDefinitionItem => {
        const etapeDefinitionIdentifier = getEtapeDefinitionIdentifier(etapeDefinitionItem);
        if (etapeDefinitionIdentifier == null || etapeDefinitionCollectionIdentifiers.includes(etapeDefinitionIdentifier)) {
          return false;
        }
        etapeDefinitionCollectionIdentifiers.push(etapeDefinitionIdentifier);
        return true;
      });
      return [...etapeDefinitionsToAdd, ...etapeDefinitionCollection];
    }
    return etapeDefinitionCollection;
  }
}
