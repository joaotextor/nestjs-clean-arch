import { Entity } from "@/shared/domain/entities/entity";
import { InMemoryRepository } from "../../in-memory.repository";

type StubEntityData = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityData> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe("InMemoryRepository unit tests", () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it("Should insert a new entity", async () => {
    const entity = new StubEntity({ name: "any_name", price: 10 });
    await sut.insert(entity);
    console.log(sut.items);
    expect(sut.items).toStrictEqual([entity]);
    console.log(sut.items[0].toJSON());
    expect(sut.items[0].toJSON()).toStrictEqual(entity.toJSON());
  });
});
