import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../../users.controller";
import { UserOutput } from "@/users/application/dto/user-output";
import { SignupUseCase } from "@/users/application/usecases/signup.usecase";
import { SignupDto } from "../../dtos/signup.dto";

describe("UsersController unit tests", () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    sut = new UsersController();
    id = "b6ce205d-16d1-4a82-8d0a-324db4a94b3c";
    props = {
      id,
      name: "John Doe",
      email: "a@a.com",
      password: "1234",
      createdAt: new Date(),
    };
  });

  it("should be defined", () => {
    expect(sut).toBeDefined();
  });
  it("should create a user", async () => {
    const output: SignupUseCase.Output = props;
    const mockSignupUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };
    sut["signupUseCase"] = mockSignupUseCase as any;
    const input: SignupDto = {
      name: "John Doe",
      email: "a@a.com",
      password: "1234",
    };

    const result = await sut.create(input);
    expect(result).toMatchObject(output);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  });
});
