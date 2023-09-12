import { BcryptjsHashProvider } from "../../bcryptjs-hash.provider";

describe("BcryptjsHashProvider tests", () => {
  let sut: BcryptjsHashProvider;
  let password: string;
  let hash: string;

  beforeEach(async () => {
    sut = new BcryptjsHashProvider();
    password = "TestePassword1234";
    hash = await sut.generateHash(password);
  });

  it("Should generate a encrypted password", async () => {
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it("Should return false when comparing an invalid password with a hash", async () => {
    const result = await sut.compareHash("fakePassword", hash);
    expect(result).toBeFalsy;
  });

  it("Should return true when comparing a valid password with its hash", async () => {
    const result = await sut.compareHash(password, hash);
    expect(result).toBeTruthy;
  });
});
