const mongoose = require('mongoose');
const { schema } = mongoose ;

const FeatureSchema = new mongoose.Schema({
    laptop_id : {
        type : String,
        required : true
    },
    backlit_keyboard : {
        type : String,
        required : true
    },
    hd_webcam : {
        type : String,
        required : true
    },
    wifi_6 : {
        type : String,
        required : true
    },
    bluetooth : {
        type : String,
        required : true
    },
    thunderbolt_port : {
        type : String,
        required : true
    },
    hdmi_port : {
        type : String,
        required : true
    },
    usb_a_port : {
        type : String,
        required : true
    },
    usb_c_port : {
        type : String,
        required : true
    },
    added_on : {
        type : Date,
        default : Date.now
    }

})
const Features = mongoose.model('Feature', FeatureSchema);
module.exports = Features;