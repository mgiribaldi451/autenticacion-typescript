import bcrypt from 'bcrypt'

function validatePass(user:any, password:any) {
    return bcrypt.compareSync(password, user.password)
}

export default validatePass