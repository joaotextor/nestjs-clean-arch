import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { UpdatePasswordUseCase } from "../../updatepassword.usecase";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { InvalidPasswordError } from "@/shared/application/errors/invalid-password-error";

describe("UpdatePasswordUseCase integration tests", () => {
  const prismaService = new PrismaClient();
  let sut: UpdatePasswordUseCase.UseCase;
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
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it("should throw error when entity not found", async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: "OldPassword",
        password: "newPassword",
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using id ${entity._id}`),
    );
  });

  it("should throw error when old password not provided", async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: "",
        password: "newPassword",
      }),
    ).rejects.toThrow(
      new InvalidPasswordError("Both password fields are required!"),
    );
  });
  it("should throw error when new password not provided", async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: "OldPassword",
        password: "",
      }),
    ).rejects.toThrow(
      new InvalidPasswordError("Both password fields are required!"),
    );
  });
  it("should throw error when old password is invalid", async () => {
    const oldPassword = await hashProvider.generateHash("1234");
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: "123456",
        password: "NewPassword",
      }),
    ).rejects.toThrow(new InvalidPasswordError("Old password is invalid!"));
  });

  it("should update a password", async () => {
    const oldPassword = await hashProvider.generateHash("1234");
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute({
      id: entity._id,
      oldPassword: "1234",
      password: "newPassword",
    });

    const result = await hashProvider.compareHash(
      "newPassword",
      output.password,
    );

    expect(result).toBeTruthy;
  });
});
