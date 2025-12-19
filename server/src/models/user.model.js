const { Schema, model} = require("mongoose");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    confirmPassword: {
        type: String,
        // required: true,
        minlength: 6,
    },
    profilePhoto: {
        type: String,
        default: "https://res.cloudinary.com/ddgiqijau/image/upload/v1764340112/Social_default_picture_zjbsbd.jpg"
    },
    bio: {
        type: String,
        default: "Content d'être à highfiveuniversity"
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: []
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: []
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: []
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: []
    }],
}, {
    timestamps: true
});

module.exports = model("User", userSchema);
