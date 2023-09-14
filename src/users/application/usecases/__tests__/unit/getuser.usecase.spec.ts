import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { SignupUseCase } from "../../signup.usecase";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { GetUserUseCase } from "../../getuser.usecase";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/users/domain/entities/user.entity";

describe("GetUserUseCase unit tests", () => {
  let sut: GetUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUseCase.UseCase(repository);
  });

  it("Should throw error when entity not found", async () => {
    await expect(() => sut.execute({ id: "fake-id" })).rejects.toThrow(
      new NotFoundError("Entity not found"),
    );
  });

  it("Should return user entity using id", async () => {
    const spyFindById = jest.spyOn(repository, "findById");
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;

    const result = await sut.execute({ id: items[0]._id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(items[0].toJSON());
  });
});
