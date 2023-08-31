import { Entity } from "@/shared/domain/entities/entity";
import { SearchableInMemoryRepository } from "../../searchable-in-memory.repository";

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

  // describe("applySort method", () => {});

  // describe("applyPaginate method", () => {});

  // describe("search method", () => {});
});