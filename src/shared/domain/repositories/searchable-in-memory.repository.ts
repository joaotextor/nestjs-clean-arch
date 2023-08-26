import { Entity } from "../entities/entity";
import { InMemoryRepository } from "./in-memory.repository";
import { SearchableRepositoryInterface } from "./searchable-repository-contracts";

export abstract class SearchableInMemoryRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  search(search: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
