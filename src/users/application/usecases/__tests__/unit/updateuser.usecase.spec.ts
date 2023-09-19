import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UpdateUserUseCase } from "../../updateuser.usecase";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe("UpdateUserUseCase unit tests", () => {
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase.UseCase(repository);
  });

  it("Should throw error when entity not found", async () => {
    await expect(() =>
      sut.execute({ id: "fake-id", name: "fake-name" }),
    ).rejects.toThrow(new NotFoundError("Entity not found"));
  });

  it("Should throw error when name not provided", async () => {
    await expect(() =>
      sut.execute({ id: "fake-id", name: "" }),
    ).rejects.toThrow(new BadRequestError("Name is required!"));
  });

  it("Should update user when all input is valid", async () => {
    const spyUpdate = jest.spyOn(repository, "update");
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;

    const result = await sut.execute({ id: items[0]._id, name: "new-name" });
    expect(spyUpdate).toHaveBeenCalled();
    expect(result).toMatchObject({ id: items[0]._id, name: "new-name" });
  });
});
