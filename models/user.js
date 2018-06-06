module.exports = (mongoose) => {
    const UserSchema = new mongoose.Schema({
        id: String,
        userId: String,
        password: String,
        name: String,
        username: String,
        profilePicture: String,
        isDrop: {
            type: Boolean,
            default : false
        },
        createdAt: {
            type: Date,
            default : Date.now
        },
        updatedAt: {
            type: Date,
            default : Date.now
        },
        dropAt: Date
    })

    return mongoose.model('user', UserSchema)
}