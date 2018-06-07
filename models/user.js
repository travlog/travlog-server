module.exports = (mongoose) => {
    const UserSchema = new mongoose.Schema({
        id: {
            type: String,
            index : true
        },
        userId: {
            type: String,
            index : true
        },
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