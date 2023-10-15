export enum userRole {
    ADMIN = 'ADMIN',
    PATIENT = 'PATIENT',
    DEFAULT = 'USER'
}

export const roleValue = (role : string | null) => {

    if (role == null) {
        return true;
    }
    Object.values(userRole).forEach((value) => {
        if (role == value) {
            return true;
        }
    })
}