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
import { isEntityName } from "typescript";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { ConflictError } from "@/shared/domain/errors/conflict-error";

describe("UserPrismaRepository integration tests", () => {
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

  describe("findById method", () => {
    it("should throw error when entity not found", async () => {
      await expect(() => sut.findById("fake-id")).rejects.toThrow(
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

  describe("insert method", () => {
    it("should return all users", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await sut.insert(entity);

      const result = await prismaService.user.findUnique({
        where: {
          id: entity._id,
        },
      });

      expect(result).toStrictEqual(entity.toJSON());
    });
  });
  describe("findAll method", () => {
    it("should insert a new entity", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      const newUser = await prismaService.user.create({
        data: entity.toJSON(),
      });

      const entities = await sut.findAll();

      expect(entities).toHaveLength(1);

      expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));

      /** Same as above
       * entities.map((item) => {
       *   expect(item.toJSON).toStrictEqual(entity.toJSON);
       * });
       */
    });
  });

  describe("search method", () => {
    it("should apply only pagination when no params are provided", async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(16).fill(UserDataBuilder({}));
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

      const searchOutput = await sut.search(new UserRepository.SearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(UserEntity);
      });

      items.reverse().forEach((item, index) => {
        expect(`teste${index + 1}@mail.com`).toBe(item.email);
      });
    });
    it("should search using filter, sort and paginate", async () => {
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
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: "name",
          sortDir: "asc",
          filter: "TEST",
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: "name",
          sortDir: "asc",
          filter: "TEST",
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
    });
  });

  describe("update method", () => {
    it("should throw error on update when entity not found", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await expect(() => sut.update(entity)).rejects.toThrow(
        new NotFoundError(`UserModel not found using id ${entity._id}`),
      );
    });

    it("should update an entity", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      const newUser = await prismaService.user.create({
        data: entity.toJSON(),
      });

      entity.update("new name");

      await sut.update(entity);

      const output = await prismaService.user.findUnique({
        where: {
          id: entity._id,
        },
      });

      expect(output.name).toBe("new name");
    });
  });
  describe("delete method", () => {
    it("should throw error on update when entity not found", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await expect(() => sut.delete(entity._id)).rejects.toThrow(
        new NotFoundError(`UserModel not found using id ${entity._id}`),
      );
    });

    it("should delete an entity", async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      const newUser = await prismaService.user.create({
        data: entity.toJSON(),
      });

      await sut.delete(entity._id);

      const output = await prismaService.user.findUnique({
        where: {
          id: entity._id,
        },
      });

      expect(output).toBeNull();
    });
  });

  describe("findByEmail method", () => {
    it("Should throw error when user not found", async () => {
      await expect(() => sut.findByEmail("fake-email")).rejects.toThrow(
        new NotFoundError("User not found using email fake-email"),
      );
    });

    it("Should find an user by email", async () => {
      const entity = new UserEntity(UserDataBuilder({ email: "a@a.com" }));
      const newUser = await prismaService.user.create({
        data: entity.toJSON(),
      });

      const output = await sut.findByEmail("a@a.com");

      expect(output.toJSON).toStrictEqual(entity.toJSON);
    });
  });

  describe("emailExists method", () => {
    it("Should throw ConflictError when email exists", async () => {
      const entity = new UserEntity(UserDataBuilder({ email: "a@a.com" }));
      const newUser = await prismaService.user.create({
        data: entity.toJSON(),
      });

      await expect(() => sut.emailExists("a@a.com")).rejects.toThrow(
        new ConflictError("Email address already used"),
      );
    });
    it("Should not find an entity by email", async () => {
      expect.assertions(0);
      await sut.emailExists("a@a.com");
    });
  });
});
