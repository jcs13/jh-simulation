import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParcoursDefinition, getParcoursDefinitionIdentifier } from '../parcours-definition.model';

export type EntityResponseType = HttpResponse<IParcoursDefinition>;
export type EntityArrayResponseType = HttpResponse<IParcoursDefinition[]>;

@Injectable({ providedIn: 'root' })
export class ParcoursDefinitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parcours-definitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parcoursDefinition: IParcoursDefinition): Observable<EntityResponseType> {
    return this.http.post<IParcoursDefinition>(this.resourceUrl, parcoursDefinition, { observe: 'response' });
  }

  update(parcoursDefinition: IParcoursDefinition): Observable<EntityResponseType> {
    return this.http.put<IParcoursDefinition>(
      `${this.resourceUrl}/${getParcoursDefinitionIdentifier(parcoursDefinition) as number}`,
      parcoursDefinition,
      { observe: 'response' }
    );
  }

  partialUpdate(parcoursDefinition: IParcoursDefinition): Observable<EntityResponseType> {
    return this.http.patch<IParcoursDefinition>(
      `${this.resourceUrl}/${getParcoursDefinitionIdentifier(parcoursDefinition) as number}`,
      parcoursDefinition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParcoursDefinition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParcoursDefinition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParcoursDefinitionToCollectionIfMissing(
    parcoursDefinitionCollection: IParcoursDefinition[],
    ...parcoursDefinitionsToCheck: (IParcoursDefinition | null | undefined)[]
  ): IParcoursDefinition[] {
    const parcoursDefinitions: IParcoursDefinition[] = parcoursDefinitionsToCheck.filter(isPresent);
    if (parcoursDefinitions.length > 0) {
      const parcoursDefinitionCollectionIdentifiers = parcoursDefinitionCollection.map(
        parcoursDefinitionItem => getParcoursDefinitionIdentifier(parcoursDefinitionItem)!
      );
      const parcoursDefinitionsToAdd = parcoursDefinitions.filter(parcoursDefinitionItem => {
        const parcoursDefinitionIdentifier = getParcoursDefinitionIdentifier(parcoursDefinitionItem);
        if (parcoursDefinitionIdentifier == null || parcoursDefinitionCollectionIdentifiers.includes(parcoursDefinitionIdentifier)) {
          return false;
        }
        parcoursDefinitionCollectionIdentifiers.push(parcoursDefinitionIdentifier);
        return true;
      });
      return [...parcoursDefinitionsToAdd, ...parcoursDefinitionCollection];
    }
    return parcoursDefinitionCollection;
  }
}
