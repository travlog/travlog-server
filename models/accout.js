module.exports = (mongoose) => {
    const AccountSchema = new mongoose.Schema({
        id: String,
        uid: String,
        email: String,
        userId: String,
        name: String,
        profilePicture: String,
        provider: String,
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

    return mongoose.model('account', AccountSchema)
}