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

  @Post()
  async create(@Body() signupDto: SignupDto) {
    return this.signupUseCase.execute(signupDto);
  }

  @HttpCode(200)
  @Post("login")
  async login(@Body() signinDto: SigninDto) {
    return this.signinUseCase.execute(signinDto);
  }

  @Get()
  async search(@Query() SearchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(SearchParams);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.getUserUseCase.execute({ id });
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id, ...updateUserDto });
  }

  @Patch(":id")
  async updatePassword(
    @Param("id") id: string,
    @Body() UpdatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordUseCase.execute({ id, ...UpdatePasswordDto });
  }

  @HttpCode(204)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
