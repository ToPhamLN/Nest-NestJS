
export enum Role {
    ADMIN = "admin",
    USER = "user",
}
export type User = {
    email: string;
    password: string;
    role: Role;
};