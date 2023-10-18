const mongoose = require('mongoose');
const { schema } = mongoose;

const SpecificationSchema = new mongoose.Schema({
    laptop_id: {
        type: String,
        required: true
    },
    processor: {
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    },
    storage: {
        type: String,
        required: true
    },
    display: {
        type: String,
        required: true
    },
    operating_system: {
        type: String,
        required: true
    },
    battery_life: {
        type: String,
        required: true
    },
    added_on : {
        type : Date,
        default : Date.now
    }
})

const Specifications = mongoose.model('Specifications',SpecificationSchema);
module.exports = Specifications;