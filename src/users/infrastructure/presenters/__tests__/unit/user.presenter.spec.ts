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

  describe("constructor", () => {
    it("should be defined", () => {
      const sut = new UserPresenter(props);
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  });
});
