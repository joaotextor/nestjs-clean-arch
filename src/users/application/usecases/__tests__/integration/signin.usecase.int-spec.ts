import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { SigninUseCase } from "../../signin.usecase";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";
import { InvalidCredentialsError } from "@/shared/application/errors/invalid-credentials-error";

describe("SignInUseCase integration tests", () => {
  const prismaService = new PrismaClient();
  let sut: SigninUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    await prismaService.$connect();
    repository = new UserPrismaRepository(prismaService as PrismaService);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new SigninUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it("should throw error when trying to signin using wrong email", async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        email: entity.email,
        password: entity.password,
      }),
    ).rejects.toThrow(
      new NotFoundError(`User not found using email ${entity.email}`),
    );
  });

  it("should throw error when email not provided", async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        email: "",
        password: entity.password,
      }),
    ).rejects.toThrow(new BadRequestError("Input data not provided!"));
  });
  it("should throw error when password not provided", async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        email: entity.email,
        password: "",
      }),
    ).rejects.toThrow(new BadRequestError("Input data not provided!"));
  });

  it("should throw error when wrong password was provided", async () => {
    const hashPassword = await hashProvider.generateHash("1234");
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        email: entity.email,
        password: "12345",
      }),
    ).rejects.toThrow(new InvalidCredentialsError("Invalid credentials!"));
  });

  it("should be able to authenticate", async () => {
    const hashPassword = await hashProvider.generateHash("1234");
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const result = await sut.execute({
      email: entity.email,
      password: "1234",
    });

    expect(result).toMatchObject(entity.toJSON());
  });
});
