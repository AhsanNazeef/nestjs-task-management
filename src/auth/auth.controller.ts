import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  registerUser(@Body(ValidationPipe) user: createUserDto): Promise<void> {
    return this.authService.register(user);
  }

  @Post('login')
  loginUser(
    @Body(ValidationPipe) user: loginUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(user);
  }
}
