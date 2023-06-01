export interface PasswordChangeRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    email: string;
}