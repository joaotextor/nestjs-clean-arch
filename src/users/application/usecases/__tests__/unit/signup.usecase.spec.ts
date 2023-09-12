import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { SignupUseCase } from "../../signup.usecase";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { ConflictError } from "@/shared/domain/errors/conflict-error";
import { BadRequestError } from "@/users/application/errors/bad-request-error";

describe("UserInMemoryRepository unit tests", () => {
  let sut: SignupUseCase.UseCase;
  let repository: UserRepository.Repository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SignupUseCase.UseCase(repository, hashProvider);
  });

  it("Should create a user", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    const props = UserDataBuilder({});
    const result = await sut.execute(props);

    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it("Should not be able to create user when email already exists", async () => {
    const props = UserDataBuilder({ email: "a@a.com" });
    await sut.execute(props);

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("Should throw error when name not provided", async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it("Should throw error when email not provided", async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it("Should throw error when password not provided", async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
