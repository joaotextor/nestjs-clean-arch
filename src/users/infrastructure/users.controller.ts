import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Query,
  Put,
} from "@nestjs/common";
import { SignupDto } from "./dtos/signup.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { SignupUseCase } from "../application/usecases/signup.usecase";
import { SigninUseCase } from "../application/usecases/signin.usecase";
import { UpdateUserUseCase } from "../application/usecases/updateuser.usecase";
import { UpdatePasswordUseCase } from "../application/usecases/updatepassword.usecase";
import { GetUserUseCase } from "../application/usecases/getuser.usecase";
import { DeleteUserUseCase } from "../application/usecases/deleteuser.usecase";
import { ListUsersUseCase } from "../application/usecases/listusers.usecase";
import { SigninDto } from "./dtos/signin.dto";
import { ListUsersDto } from "./dtos/list-users.dto";
import { UpdatePasswordDto } from "./dtos/update-password.dto";
import { UserOutput } from "../application/dto/user-output";
import {
  UserCollectionPresenter,
  UserPresenter,
} from "./presenters/user.presenter";

@Controller("users")
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase;

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase;

  @Inject(UpdatePasswordUseCase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase;

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase;

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output);
  }

  static listUsersToResponse(output: ListUsersUseCase.Output) {
    return new UserCollectionPresenter(output);
  }

  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output);
  }

  @HttpCode(200)
  @Post("login")
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);
    return UsersController.userToResponse(output);
  }

  @Get()
  async search(@Query() SearchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(SearchParams);
    return UsersController.listUsersToResponse(output);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
    return UsersController.userToResponse(output);
  }

  @Patch(":id")
  async updatePassword(
    @Param("id") id: string,
    @Body() UpdatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...UpdatePasswordDto,
    });
    return UsersController.userToResponse(output);
  }

  @HttpCode(204)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
