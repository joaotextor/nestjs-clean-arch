import { ValidationError } from "@/shared/domain/errors/validation-error";
import { PrismaClient, User } from "@prisma/client";
import { execSync } from "node:child_process";
import { UserModelMapper } from "../../user-model.mapper";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";

describe("UserModelMapper integration tests", () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();

    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: "d4255494-f981-4d26-a2a1-35d3f5b8d36a",
      name: "John Doe",
      email: "a@a.com",
      password: "testpassword1234",
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it("should throw error when user model is invalid", () => {
    const model: User = Object.assign(props, { name: null });
    expect(() => UserModelMapper.toEntity(model)).toThrowError(
      new ValidationError("Entity could not be loaded."),
    );
  });
  it("should convert a user model to a user entity", async () => {
    const model: User = await prismaService.user.create({
      data: props,
    });
    const sut = UserModelMapper.toEntity(model);
    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.toJSON()).toStrictEqual(props);
  });
});
