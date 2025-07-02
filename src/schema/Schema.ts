import { Schema, model } from 'mongoose';


const contentTypes: string[] = [
    'image', 
    'video', 
    'article', 
    'audio',
    'post'
];
const UserSchema = new Schema({
    username: {
        type : String,
        unique: true,
        required : true
    },
    password : {
        type : String,
        required: true
    }
})

const ContentSchema = new Schema({
    link : {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: contentTypes,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [{
        type : Schema.Types.ObjectId,
        ref : 'tag'
    }],
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user',
    }

});

const TagSchema = new Schema({
    title : {
        type: String,
        required: true,
    }
})

const ShareLinkSchema = new Schema({
    hash: {
        type: String,
        required: true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user',
        required: true,
        unique: true
    }
})


interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
}
 
const User = model('user', UserSchema);
const Content = model('content', ContentSchema);
const Tags = model('tag', TagSchema);
const ShareLink = model('link', ShareLinkSchema);

export {User, Content, Tags, ShareLink, IUser};
