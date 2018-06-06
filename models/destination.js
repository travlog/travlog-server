module.exports = (mongoose) => {
    const DestinationSchema = new mongoose.Schema({
        id: String,
        nid: String,
        lid: String,
        startDate: Date,
        endDate: Date,
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

    return mongoose.model('destination', DestinationSchema)
}