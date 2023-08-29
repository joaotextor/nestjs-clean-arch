import { Entity } from "../entities/entity";
import { InMemoryRepository } from "./in-memory.repository";
import { SearchableRepositoryInterface } from "./searchable-repository-contracts";

export abstract class SearchableInMemoryRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  async search(search: SearchParams): Promise<SearchResult<E>> {
    throw new Error("Method not implemented.");
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySorter(
    items: E[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<E[]>; {}

  protected async applyPaginate(
    items: E[],
    page: SearchParams["page"],
    perPage: SearchParams["perPage"],
  ): Promise<E[]> {}
}
