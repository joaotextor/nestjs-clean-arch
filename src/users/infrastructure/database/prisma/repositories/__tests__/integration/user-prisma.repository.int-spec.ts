import { ValidationError } from "@/shared/domain/errors/validation-error";
import { PrismaClient, User } from "@prisma/client";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";
import { UserModelMapper } from "../../../models/user-model.mapper";
import { UserPrismaRepository } from "../../user-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe("UserModelMapper integration tests", () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as PrismaService);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it("should throw error when entity not found", () => {
    expect(() => sut.findById("fake-id")).rejects.toThrow(
      new NotFoundError("UserModel not found using id fake-id"),
    );
  });
  it("should find an entity by id", async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.findById(newUser.id);
    expect(output.toJSON).toStrictEqual(entity.toJSON);
  });
});
