import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserInMemoryRepository } from "../../user-in-memory.repository";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { ConflictError } from "@/shared/domain/errors/conflict-error";

describe("UserInMemoryRepository unit tests", () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  describe("findByEmail unit tests", () => {
    it("Should throw error when not found", async () => {
      expect(sut.findByEmail("a@a.com")).rejects.toThrowError(
        new NotFoundError("Entity not found using email a@a.com"),
      );
    });

    it("Should find entity by email", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      sut.insert(entity);
      const result = await sut.findByEmail(entity.email);
      expect(result.toJSON()).toStrictEqual(entity.toJSON());
    });
  });

  describe("emailExists method", () => {
    it("Should throw error when email already exists", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      sut.insert(entity);
      expect(sut.emailExists(entity.email)).rejects.toThrowError(
        new ConflictError("Email address already used"),
      );
    });

    it("Should not throw error when email does not exists", async () => {
      expect.assertions(0);
      expect(sut.emailExists("a@a.com"));
    });
  });

  describe("applyFilter method", () => {
    it("Should not filter when filter is null", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      sut.insert(entity);
      const result = await sut.findAll();
      const spyFilter = jest.spyOn(result, "filter");
      const itemsFiltered = await sut["applyFilter"](result, null);
      expect(spyFilter).not.toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual(result);
    });

    it("Should filter name field using filter param", async () => {
      const items = [
        new UserEntity(UserDataBuilder({ name: "Test" })),
        new UserEntity(UserDataBuilder({ name: "TEST" })),
        new UserEntity(UserDataBuilder({ name: "test" })),
        new UserEntity(UserDataBuilder({ name: "fake" })),
      ];
      const spyFilter = jest.spyOn(items, "filter");
      const itemsFiltered = await sut["applyFilter"](items, "test");
      expect(spyFilter).toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]]);
    });
  });
});
