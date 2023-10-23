import { instanceToPlain } from "class-transformer";
import { UserPresenter } from "../../user.presenter";

describe("UserPresenter unit tests", () => {
  const createdAt = new Date();
  const props = {
    id: "c4583bac-a75f-431d-9ba3-adf91ed686dc",
    name: "Test Name",
    email: "a@a.com",
    password: "fake-password",
    createdAt,
  };
  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe("constructor", () => {
    it("should be defined", () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  });

  it("should present data", () => {
    const output = instanceToPlain(sut);
    expect(output).toMatchObject({
      id: "c4583bac-a75f-431d-9ba3-adf91ed686dc",
      name: "Test Name",
      email: "a@a.com",
      createdAt: createdAt.toISOString(),
    });
  });
});
