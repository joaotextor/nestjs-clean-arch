import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { DeleteUserUseCase } from "../../deleteuser.usecase";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe("DeleteUseCase integration tests", () => {
  const prismaService = new PrismaClient();
  let sut: DeleteUserUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    await prismaService.$connect();
    repository = new UserPrismaRepository(prismaService as PrismaService);
  });

  beforeEach(async () => {
    sut = new DeleteUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it("should throw error when entity not found", async () => {
    await expect(() => sut.execute({ id: "fake-id" })).rejects.toThrow(
      new NotFoundError("UserModel not found using id fake-id"),
    );
  });
  it("should delete a user", async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const user = await prismaService.user.create({
      data: entity.toJSON(),
    });
    await sut.execute({ id: user.id });
    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });
    expect(output).toBeNull();
    const models = await prismaService.user.findMany();
    expect(models).toHaveLength(0);
  });
});
