const userRole = {
    ADMIN : 'ADMIN',
    PATIENT : 'PATIENT',
    DEFAULT : 'USER'
}

const roleValue = (role) => {

    if (role == null) {
        return true;
    }
    Object.values(userRole).forEach((value) => {
        if (role == value) {
            return true;
        }
    })
}

module.exports = { userRole, roleValue} ;