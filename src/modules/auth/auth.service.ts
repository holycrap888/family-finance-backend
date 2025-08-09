import { RegisterDto } from "@/common/dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwt: JwtService
    ) { }

    async register(dto: RegisterDto): Promise<void> {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) throw new Error('Email already exists');

        const passwordHash = await bcrypt.hash(dto.password, 10);
        await this.usersService.createUser({
            name: dto.name,
            email: dto.email,
            passwordHash,
            salary: dto.salary,
            settings: {
                budgetRatio: {
                    needs: 50,
                    savings: 20,
                    wants: 10,
                    investments: 10,
                    emergency: 10
                }
            }
        });
    }

    async login(email: string, password: string): Promise<{ accessToken: string }> {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException();

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new UnauthorizedException();

        const payload = { sub: user._id ? user._id.toString() : '', email: user.email };
        return { accessToken: this.jwt.sign(payload) };
    }
}
