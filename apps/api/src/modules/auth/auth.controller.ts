import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('debug')
  @ApiOperation({ summary: 'Debug info' })
  async debug() {
    return {
      nodeEnv: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
      useMock: process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL,
    };
  }

  @Post('test')
  @ApiOperation({ summary: 'Test endpoint' })
  async test() {
    return { message: 'Test endpoint working' };
  }

  @Post('simple-register')
  @ApiOperation({ summary: 'Simple register without JWT' })
  async simpleRegister(@Body() registerDto: RegisterDto) {
    return {
      message: 'User registered successfully',
      user: {
        email: registerDto.email,
        name: registerDto.name,
        id: 'simple-id',
      },
    };
  }
}
