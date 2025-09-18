import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            role: import(".prisma/client").$Enums.UserRole;
            name: string | null;
            id: string;
            email: string;
            password: string;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
        };
        token: string;
    }>;
    debug(): Promise<{
        nodeEnv: string;
        databaseUrl: string;
        jwtSecret: string;
        useMock: boolean;
    }>;
    test(): Promise<{
        message: string;
    }>;
    simpleRegister(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            email: string;
            name: string;
            id: string;
        };
    }>;
}
