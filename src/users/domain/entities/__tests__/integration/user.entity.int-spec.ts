import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity, UserProps } from "../../user.entity";
import { EntityValidationError } from "@/shared/domain/validators/errors/validation-error";

describe("UserEntity integration tests", () => {
  let props: UserProps;
  describe("Constructor method", () => {
    it("should throw an error when creating a user with invalid name", () => {
      props = {
        ...UserDataBuilder({}),
        name: null,
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        name: "",
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        name: 10 as any,
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        name: "a".repeat(256),
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
    it("should throw an error when creating a user with invalid email", () => {
      props = {
        ...UserDataBuilder({}),
        email: null,
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        email: "",
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        email: 10 as any,
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        email: "a".repeat(256),
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
    it("should throw an error when creating a user with invalid password", () => {
      props = {
        ...UserDataBuilder({}),
        password: null,
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        password: "",
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        password: 10 as any,
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        password: "a".repeat(101),
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
    it("should throw an error when creating a user with invalid createdAt", () => {
      props = {
        ...UserDataBuilder({}),
        createdAt: "2023" as any,
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);

      props = {
        ...UserDataBuilder({}),
        createdAt: 10 as any,
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
  });
});
