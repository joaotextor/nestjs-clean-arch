import { UserRepository } from "@/users/domain/repositories/user.repository";
import { ListUsersUseCase } from "../../listusers.usecase";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe("ListUsersUseCase unit tests", () => {
  let sut: ListUsersUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUseCase.UseCase(repository);
  });

  describe("toOutput method", () => {
    it("Should return a empty array of items when SearchResult has no items", () => {
      const result = new UserRepository.SearchResult({
        items: [],
        total: 1,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });

      const output = sut["toOutput"](result);

      expect(output).toStrictEqual({
        items: [],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 2,
      });
    });

    it("Should return a array with users objects when SearchResult has items", () => {
      const entity = new UserEntity(UserDataBuilder({}));

      const result = new UserRepository.SearchResult({
        items: [entity],
        total: 1,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });

      const output = sut["toOutput"](result);

      expect(output).toStrictEqual({
        items: [entity.toJSON()],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 2,
      });
    });

    it("Should return the users ordered by createdAt - descending order.", async () => {
      const createdAt = new Date();
      const items = [
        new UserEntity(UserDataBuilder({ createdAt })),
        new UserEntity(
          UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
        ),
        new UserEntity(
          UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 2) }),
        ),
      ];

      repository.items = items;

      const output = await sut.execute({});

      expect(output).toStrictEqual({
        items: [...items].reverse().map((item) => item.toJSON()),
        total: 3,
        currentPage: 1,
        lastPage: 1,
        perPage: 15,
      });
    });

    it("Should return the users using pagination, sort and filter.", async () => {
      const items = [
        new UserEntity(UserDataBuilder({ name: "a" })),
        new UserEntity(UserDataBuilder({ name: "AA" })),
        new UserEntity(UserDataBuilder({ name: "Aa" })),
        new UserEntity(UserDataBuilder({ name: "b" })),
        new UserEntity(UserDataBuilder({ name: "c" })),
      ];

      repository.items = items;

      let output = await sut.execute({
        page: 1,
        perPage: 2,
        sort: "name",
        sortDir: "asc",
        filter: "a",
      });

      expect(output).toStrictEqual({
        items: [items[1].toJSON(), items[2].toJSON()],
        total: 3,
        currentPage: 1,
        lastPage: 2,
        perPage: 2,
      });

      output = await sut.execute({
        page: 2,
        perPage: 2,
        sort: "name",
        sortDir: "asc",
        filter: "a",
      });

      expect(output).toStrictEqual({
        items: [items[0].toJSON()],
        total: 3,
        currentPage: 2,
        lastPage: 2,
        perPage: 2,
      });

      output = await sut.execute({
        page: 1,
        perPage: 2,
        sort: "name",
        sortDir: "desc",
        filter: "a",
      });

      expect(output).toStrictEqual({
        items: [items[0].toJSON(), items[2].toJSON()],
        total: 3,
        currentPage: 1,
        lastPage: 2,
        perPage: 2,
      });

      output = await sut.execute({
        page: 2,
        perPage: 2,
        sort: "name",
        sortDir: "desc",
        filter: "a",
      });

      expect(output).toStrictEqual({
        items: [items[1].toJSON()],
        total: 3,
        currentPage: 2,
        lastPage: 2,
        perPage: 2,
      });
    });
  });
});
