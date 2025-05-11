export type UserRole = 'Patient' | 'HealthCareProfessional' | 'Admin';

export interface IUser {
    id: string;
    email: string;
    mobile?: string;
    passwordHash: string;
    role: UserRole;
    name: string;
    dateOfBirth?: string;
    practiceId?: string;
    createdAt?: string;
    updatedAt?: string;
}
