import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";
import { SigninUseCase } from "../../signin.usecase";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { InvalidCredentialsError } from "@/shared/application/errors/invalid-credentials-error";

describe("SignupUseCase unit tests", () => {
  let sut: SigninUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SigninUseCase.UseCase(repository, hashProvider);
  });

  it("Should authenticate a user", async () => {
    const spyFindByEmail = jest.spyOn(repository, "findByEmail");
    const password = "1234";
    const hashPassword = await hashProvider.generateHash(password);
    const entity = new UserEntity(
      UserDataBuilder({ email: "a@a.com", password: hashPassword }),
    );
    repository.items = [entity];

    const result = await sut.execute({
      email: entity.email,
      password: password,
    });

    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(entity.toJSON());
  });

  it("Should throw a 'BadRequestError' when email is not provided", async () => {
    const props = { email: "", password: "1234" };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it("Should throw a 'BadRequestError' when password is not provided", async () => {
    const props = { email: "a@a.com", password: "" };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
  it("Should throw a 'NotFoundError' when email does not exists", async () => {
    const props = { email: "a@a.com", password: "1234" };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
  it("Should throw a 'InvalidCredentialsError' when password is wrong", async () => {
    const password = "1234";
    const hashPassword = await hashProvider.generateHash(password);
    const entity = new UserEntity(
      UserDataBuilder({ email: "a@a.com", password: hashPassword }),
    );
    repository.items = [entity];
    const props = { email: "a@a.com", password: "fake" };
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
