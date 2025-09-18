import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthServiceMock {
    private jwtService;
    private users;
    constructor(jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            createdAt: any;
        };
        token: string;
    }>;
    private generateToken;
}
