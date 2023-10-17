import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user-prisma.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { ListUsersUseCase } from "../../listusers.usecase";

describe("DeleteUseCase integration tests", () => {
  const prismaService = new PrismaClient();
  let sut: ListUsersUseCase.UseCase;
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
    sut = new ListUsersUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it("should return users ordered by 'createdAt'", async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];

    const arrange = Array(3).fill(UserDataBuilder({}));
    arrange.forEach((entity, index) => {
      entities.push(
        new UserEntity({
          ...entity,
          name: `User${index}`,
          email: `teste${index}@mail.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      );
    });

    await prismaService.user.createMany({
      data: entities.map((entity) => entity.toJSON()),
    });

    const searchOutput = await sut.execute({});
    expect(searchOutput).toStrictEqual({
      items: entities.reverse().map((item) => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it("should return users using filter, pagination and sort", async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];

    const arrange = ["test", "a", "TEST", "b", "TeSt"];
    arrange.forEach((entity, index) => {
      entities.push(
        new UserEntity({
          ...UserDataBuilder({ name: entity }),
          createdAt: new Date(createdAt.getTime() + index),
        }),
      );
    });

    await prismaService.user.createMany({
      data: entities.map((entity) => entity.toJSON()),
    });

    let searchOutput = await sut.execute({
      page: 1,
      perPage: 2,
      sort: "name",
      sortDir: "asc",
      filter: "TEST",
    });

    expect(searchOutput).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    searchOutput = await sut.execute({
      page: 2,
      perPage: 2,
      sort: "name",
      sortDir: "asc",
      filter: "TEST",
    });

    expect(searchOutput).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});
