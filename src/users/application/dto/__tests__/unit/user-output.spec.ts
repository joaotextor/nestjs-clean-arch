import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { UserOutputMapper } from "../../user-output";

describe("UserOutputMapper unit tests", () => {
  const entity = new UserEntity(UserDataBuilder({}));

  it("Should convert a UserEntity to UserOutput", () => {
    const spyToJson = jest.spyOn(entity, "toJSON");
    const sut = UserOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
