module.exports = (mongoose) => {
    const NoteSchema = new mongoose.Schema({
        id: {
            type: String,
            index: true
        },
        uid: {
            type: String,
            index: true
        },
        title: String,
        destinations: [{
            id: {
                type: String,
                index: true
            },
            nid: {
                type: String,
                index: true
            },
            lid: {
                type: String,
                index: true
            },
            startDate: {
                type: Date,
                index: true
            },
            endDate: {
                type: Date,
                index: true
            },
            isDrop: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            },
            dropAt: Date
        }],
        memo: String,
        isDrop: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        dropAt: Date
    })

    return mongoose.model('note', NoteSchema)
}