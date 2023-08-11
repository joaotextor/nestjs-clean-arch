import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserEntity, UserProps } from "../../user.entity";
import { EntityValidationError } from "@/shared/domain/validators/errors/validation-error";

describe("UserEntity integration tests", () => {
  let props: UserProps;
  const entity = new UserEntity(UserDataBuilder({}));

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
    it("Should be a valid user", () => {
      expect.assertions(0);
      props = {
        ...UserDataBuilder({}),
      };

      new UserEntity(props);
      // expect(() => new UserEntity(props)).not.toThrowError(
      //   EntityValidationError,
      // );
    });
  });

  describe("Update method", () => {
    it("should throw an error when updating a user with invalid name", () => {
      expect(() => entity.update(null)).toThrowError(EntityValidationError);
      expect(() => entity.update("" as any)).toThrowError(
        EntityValidationError,
      );
      expect(() => entity.update(10 as any)).toThrowError(
        EntityValidationError,
      );
      expect(() => entity.update("a".repeat(256))).toThrowError(
        EntityValidationError,
      );
    });

    it("should be a valid user", () => {
      expect.assertions(0);
      entity.update("new name");
    });
  });

  describe("UpdatePassword method", () => {
    it("should throw an error when updating a user with invalid password", () => {
      expect(() => entity.updatePassword(null)).toThrowError(
        EntityValidationError,
      );
      expect(() => entity.updatePassword("")).toThrowError(
        EntityValidationError,
      );
      expect(() => entity.updatePassword(10 as any)).toThrowError(
        EntityValidationError,
      );
      expect(() => entity.updatePassword("X".repeat(101))).toThrowError(
        EntityValidationError,
      );
    });

    it("should be a valid password", () => {
      expect.assertions(0);
      entity.updatePassword("newpassword");
    });
  });
});
