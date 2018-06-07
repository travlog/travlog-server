module.exports = (mongoose) => {
    const AccountSchema = new mongoose.Schema({
        id: String,
        uid : {
            type: String,
            index : true
        },
        email: {
            type: String,
            index : true,
            unique : true
        },
        userId: {
            type: String,
            index : true,
            unique : true
        },
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