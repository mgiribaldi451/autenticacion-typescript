import bcrypt from 'bcrypt';

function createHash(password:any) {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10)
    )
}

export default createHash