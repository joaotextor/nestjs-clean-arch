import { UserEntity, UserProps } from "../../user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";

describe("UserEntity unit tests", () => {
  let props: UserProps;
  let sut: UserEntity;

  beforeEach(() => {
    props = UserDataBuilder({});

    sut = new UserEntity(props);
  });
  it("Constructor method", () => {
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });
  it("Getter of name field", () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe("string");
  });
  it("Setter of name field", () => {
    sut["name"] = "new name";
    expect(sut.name).toEqual("new name");
    expect(typeof sut.name).toBe("string");
  });
  it("Getter of email field", () => {
    expect(sut.email).toBeDefined();
    expect(sut.email).toEqual(props.email);
    expect(typeof sut.email).toBe("string");
  });
  it("Getter of password field", () => {
    expect(sut.password).toBeDefined();
    expect(sut.password).toEqual(props.password);
    expect(typeof sut.password).toBe("string");
  });
  it("Setter of password field", () => {
    sut["password"] = "new password";
    expect(sut.password).toEqual("new password");
    expect(typeof sut.password).toBe("string");
  });
  it("Getter of createdAt field", () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });
  it("Should update a user name", () => {
    sut.update("new name");
    expect(sut.name).toEqual("new name");
  });
  it("Should update password", () => {
    sut.update("new password");
    expect(sut.name).toEqual("new password");
  });
});
