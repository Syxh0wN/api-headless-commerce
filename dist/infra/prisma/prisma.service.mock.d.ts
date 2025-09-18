export declare class PrismaServiceMock {
    user: {
        findUnique: () => Promise<any>;
        create: (data: any) => Promise<{
            id: string;
            email: any;
            name: any;
            role: string;
            createdAt: Date;
        }>;
    };
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}
