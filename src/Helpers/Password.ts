import bcrypt from 'bcrypt'

export class Password {

    /**
     * @param {String} password
     *
     * @return Promise<String>
     */
    async generatePassword(password: String): Promise<String> {
        const saltRounds = 15
        const salt = await bcrypt.genSalt(saltRounds)
        return await bcrypt.hash(password, salt)
    }

    /**
     * @param {String} password
     * @param {String} passwordConfirmation
     */
    passwordIdem(password: String, passwordConfirmation: String) {
        return password === passwordConfirmation
    }
}