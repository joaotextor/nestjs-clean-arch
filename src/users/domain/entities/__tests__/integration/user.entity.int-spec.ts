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
        name: "a".repeat(256),
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
  });
});
