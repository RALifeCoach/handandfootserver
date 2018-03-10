import crypto from 'crypto';

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = length => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function(password, salt){
    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);

    return {
        salt,
        passwordHash: hash.digest('hex')
    };
};

export function cryptPassword(userPassword) {
    const salt = genRandomString(16); /** Gives us salt of length 16 */
    return sha512(userPassword, salt);
}

export function comparePassword(plainPass, userPassword) {
    const compare = sha512(plainPass, userPassword.salt);
    console.log(compare);
    return compare.passwordHash === userPassword.passwordHash;
}
