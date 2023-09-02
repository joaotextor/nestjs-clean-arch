import { Entity } from "@/shared/domain/entities/entity";
import { SearchableInMemoryRepository } from "../../searchable-in-memory.repository";
import {
  SearchParams,
  SearchResult,
} from "../../searchable-repository-contracts";

type StubEntityData = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityData> {}

class StubSearchableInMemoryRepository extends SearchableInMemoryRepository<StubEntity> {
  sortableFields: string[] = ["name"];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      return item.props.name.toLowerCase().includes(filter.toLowerCase());
    });
  }
}

describe("SearchableInMemoryRepository unit tests", () => {
  let sut: StubSearchableInMemoryRepository;

  beforeEach(() => {
    sut = new StubSearchableInMemoryRepository();
  });

  describe("applyFilter method", () => {
    it("Should not filter items when filter param is null", async () => {
      const items = [
        new StubEntity({
          name: "any_name",
          price: 50,
        }),
        new StubEntity({
          name: "other_name",
          price: 10,
        }),
      ];

      const spyFilterMethod = jest.spyOn(items, "filter");

      const itemsFiltered = await sut["applyFilter"](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("Should filter using filter param", async () => {
      const items = [
        new StubEntity({
          name: "test",
          price: 50,
        }),
        new StubEntity({
          name: "TEST",
          price: 30,
        }),
        new StubEntity({
          name: "fake",
          price: 10,
        }),
      ];

      const spyFilterMethod = jest.spyOn(items, "filter");

      let itemsFiltered = await sut["applyFilter"](items, "TEST");
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await sut["applyFilter"](items, "test");
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await sut["applyFilter"](items, "no-filter");
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe("applySort method", () => {
    it("Should not sort items", async () => {
      const items = [
        new StubEntity({
          name: "b",
          price: 50,
        }),
        new StubEntity({
          name: "a",
          price: 30,
        }),
      ];

      let itemsSorted = await sut["applySort"](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      //Sort by "price" not allowed. Should return the same items.
      itemsSorted = await sut["applySort"](items, "price", "asc");
      expect(itemsSorted).toStrictEqual(items);
    });

    it("Should sort items", async () => {
      const items = [
        new StubEntity({
          name: "b",
          price: 50,
        }),
        new StubEntity({
          name: "a",
          price: 30,
        }),
        new StubEntity({
          name: "c",
          price: 90,
        }),
      ];

      let itemsSorted = await sut["applySort"](items, "name", "asc");
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await sut["applySort"](items, "name", "desc");
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe("applyPaginate method", () => {
    it("Should paginate items", async () => {
      const items = [
        new StubEntity({
          name: "b",
          price: 50,
        }),
        new StubEntity({
          name: "a",
          price: 30,
        }),
        new StubEntity({
          name: "c",
          price: 90,
        }),
        new StubEntity({
          name: "d",
          price: 90,
        }),
        new StubEntity({
          name: "e",
          price: 90,
        }),
      ];

      let itemsPaginated = await sut["applyPaginate"](items, 1, 2);
      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await sut["applyPaginate"](items, 2, 2);
      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await sut["applyPaginate"](items, 3, 2);
      expect(itemsPaginated).toStrictEqual([items[4]]);

      itemsPaginated = await sut["applyPaginate"](items, 4, 2);
      expect(itemsPaginated).toStrictEqual([]);

      itemsPaginated = await sut["applyPaginate"](items, 1, 3);
      expect(itemsPaginated).toStrictEqual([items[0], items[1], items[2]]);

      itemsPaginated = await sut["applyPaginate"](items, 2, 3);
      expect(itemsPaginated).toStrictEqual([items[3], items[4]]);

      itemsPaginated = await sut["applyPaginate"](items, 3, 3);
      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe("search method", () => {
    it("Should apply only pagination when the other params are null", async () => {
      const entity = new StubEntity({ name: "any_name", price: 50 });
      const items = Array(16).fill(entity);
      sut.items = items;

      const params = await sut.search(new SearchParams());
      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      );
    });
    it("Should apply pagination and filter", async () => {
      const items = [
        new StubEntity({
          name: "test",
          price: 50,
        }),
        new StubEntity({
          name: "a",
          price: 30,
        }),
        new StubEntity({
          name: "TEST",
          price: 90,
        }),
        new StubEntity({
          name: "TeSt",
          price: 90,
        }),
      ];
      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: "TEST",
        }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: "TEST",
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: "TEST",
        }),
      );
      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filter: "TEST",
        }),
      );
    });
  });
});
