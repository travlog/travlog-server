module.exports = (mongoose) => {
    const NoteSchema = new mongoose.Schema({
        id: String,
        uid: String,
        title: String,
        memo: String,
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

    return mongoose.model('note', NoteSchema)
}