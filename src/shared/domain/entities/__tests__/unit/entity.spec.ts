import { validate as uuidValidate } from "uuid";
import { Entity } from "../../entity";

type StubProps = {
  prop1: string;
  prop2: number;
};
// É uma convenção chamar a classe dublê (para testes) de Stub
class StubEntity extends Entity<StubProps> {}

describe("Entity unit tests", () => {
  let props: StubProps;
  let sut: Entity<StubProps>;
  let id: string;

  beforeEach(() => {
    props = { prop1: "value1", prop2: 2 };
    id = "a92288fc-a6e8-465a-8f56-f2f82db8aaee";
    sut = new StubEntity(props, id);
  });
  it("Should set props and id", () => {
    expect(sut.props).toStrictEqual(props);
    expect(sut._id).not.toBeNull();
    expect(uuidValidate(sut._id)).toBeTruthy();
  });
  it("Should accept valid uuid", () => {
    expect(uuidValidate(sut._id)).toBeTruthy();
    expect(sut._id).toBe(id);
  });
  it("Should convert entity to JSON", () => {
    expect(sut.toJSON()).toStrictEqual({
      id,
      ...props,
    });
  });
});
