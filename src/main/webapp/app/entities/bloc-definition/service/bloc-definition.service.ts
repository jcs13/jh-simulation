import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlocDefinition, getBlocDefinitionIdentifier } from '../bloc-definition.model';

export type EntityResponseType = HttpResponse<IBlocDefinition>;
export type EntityArrayResponseType = HttpResponse<IBlocDefinition[]>;

@Injectable({ providedIn: 'root' })
export class BlocDefinitionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bloc-definitions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(blocDefinition: IBlocDefinition): Observable<EntityResponseType> {
    return this.http.post<IBlocDefinition>(this.resourceUrl, blocDefinition, { observe: 'response' });
  }

  update(blocDefinition: IBlocDefinition): Observable<EntityResponseType> {
    return this.http.put<IBlocDefinition>(`${this.resourceUrl}/${getBlocDefinitionIdentifier(blocDefinition) as number}`, blocDefinition, {
      observe: 'response',
    });
  }

  partialUpdate(blocDefinition: IBlocDefinition): Observable<EntityResponseType> {
    return this.http.patch<IBlocDefinition>(
      `${this.resourceUrl}/${getBlocDefinitionIdentifier(blocDefinition) as number}`,
      blocDefinition,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlocDefinition>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlocDefinition[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBlocDefinitionToCollectionIfMissing(
    blocDefinitionCollection: IBlocDefinition[],
    ...blocDefinitionsToCheck: (IBlocDefinition | null | undefined)[]
  ): IBlocDefinition[] {
    const blocDefinitions: IBlocDefinition[] = blocDefinitionsToCheck.filter(isPresent);
    if (blocDefinitions.length > 0) {
      const blocDefinitionCollectionIdentifiers = blocDefinitionCollection.map(
        blocDefinitionItem => getBlocDefinitionIdentifier(blocDefinitionItem)!
      );
      const blocDefinitionsToAdd = blocDefinitions.filter(blocDefinitionItem => {
        const blocDefinitionIdentifier = getBlocDefinitionIdentifier(blocDefinitionItem);
        if (blocDefinitionIdentifier == null || blocDefinitionCollectionIdentifiers.includes(blocDefinitionIdentifier)) {
          return false;
        }
        blocDefinitionCollectionIdentifiers.push(blocDefinitionIdentifier);
        return true;
      });
      return [...blocDefinitionsToAdd, ...blocDefinitionCollection];
    }
    return blocDefinitionCollection;
  }
}
