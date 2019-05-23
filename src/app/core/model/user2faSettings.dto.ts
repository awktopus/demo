export interface User2faSettingsDto {
    twoFactorEnabled: boolean,
    phoneNumber: string,
    phoneNumberConfirmed: boolean,
    email: string,
    emailConfirmed: boolean
}
