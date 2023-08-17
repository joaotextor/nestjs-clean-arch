import { Entity } from "@/shared/domain/entities/entity";
import { InMemoryRepository } from "../../in-memory.repository";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";

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
    /* Método utilizado pelo professor - It compares only the class properties returned by the JSON property.
     * expect(sut.items[0].toJSON()).toStrictEqual(entity.toJSON());
     */

    // Método sugerido pelo CodeWhisperer - compares the class itself
    expect(sut.items).toStrictEqual([entity]);
  });

  it("Should throw error when entity not found", async () => {
    await expect(sut.findById("any_id")).rejects.toThrow(
      new NotFoundError("Entity not found"),
    );
  });

  it("Should find a entity by id", async () => {
    const entity = new StubEntity({ name: "any_name", price: 10 });
    await sut.insert(entity);
    /* Método utilizado pelo professor
     * const result = await sut.findById(entity._id);
     * expect(entity.toJSON()).toStrictEqual(result.toJSON())
     */
    // Método sugerido pelo CodeWhisperer, que achei melhor, já que testa o próprio método, e não o resultado obtido pelo método em momento anterior do código
    await expect(sut.findById(sut.items[0].id)).resolves.toEqual(entity);
  });
});
