// controller/post.controller.js
// **************** CREATE POST ***************
// POST : api/posts

const HttpError = require("../models/error.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const uploadFile = require("../utils/uploadFile.util");

//PROTECTED
const createPost = async (req, res, next) => {
    try {
        if (!req.userId) {
            return next(new HttpError("Unauthorized", 401));
        };

        const { body } = req.body;
 
        if (!body) {
            return next(new HttpError("Fill in text field and choose image", 422));
        }
 
 
        if (!req.files || !req.files.image) {
            return next(new HttpError("Please choose an image", 422));
        }
 
        const { image } = req.files;
 
        const result = await uploadFile(image, next);
 
        // Enregistrer le post dans la DB
        const newPost = await PostModel.create({
            creator: req.userId,
            body,
            image: result,
        });
 
        // Ajouter le post à l'utilisateur
        const updatedUser = await UserModel.findByIdAndUpdate(newPost.creator, {
            $push: { posts: newPost._id },
        });
        console.log(`Le post ${newPost} a été créé avec succès ! Voici le post: \n ${updatedUser}`);
 
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
};

// **************** GET POST ***************
// GET : api/posts/:id
//PROTECTED
const getPost = async (req, res, next) => {
    try {
        //id du post à récupérer
        const { id } = req.params;
               
        // Vérifier si l'ID est valide
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid post ID", 400));
        }
 
        // const post = await PostModel.findById(id); //A commenter après la création de commnetaires et autres
        const post = await PostModel.findById(id).populate("creator").populate({path: "comments", options: {sort: {createdAt: -1}}});
        if (!post) {
            return next(new HttpError("Post not found", 402));
        }

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
}

// **************** GET POSTS ***************
// GET : api/posts
//PROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error.message || "Something went wrong", 500));
    }
}

// **************** UPDATE POSTS ***************
// PATCH : api/posts/:id
//PROTECTED
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const { body } = req.body;

        // 🔍 Récupération du post dans la base de données
        const post = await PostModel.findById(postId);

        if (!post) {
            return next(new HttpError("Post introuvable", 404));
        }

        // 🔐 Vérification que l'utilisateur connecté est bien le créateur du post
        const postCreatorId = post.creator?.toString();
        const requesterId = req.userId?.toString();

        if (postCreatorId != requesterId) {
            return next(new HttpError("Vous ne pouvez pas modifier ce post car vous n'en êtes pas le créateur", 403));
        }

        // ✏️ Préparation des données à mettre à jour
        const updateData = {};
        if (typeof body !== "undefined") updateData.body = body;

        // 📸 Si une image est uploadée, on la téléverse sur Cloudinary
        if (req.files?.image) {
            const uploadedUrl = await uploadFile(req.files.image, next);
            if (uploadedUrl) {
                updateData.image = uploadedUrl;
            }
        }

        // ℹ️ Si aucune donnée n'a été modifiée, on renvoie simplement le post actuel
        if (Object.keys(updateData).length === 0) {
            return res.status(200).json(post);
        }

        // 🔄 Mise à jour du post dans la base
        const updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedPost);

    } catch (error) {
        return next(new HttpError(error.message || "Erreur lors de la mise à jour du post", 500));
    }
};

// **************** DELETE POSTS ***************
// DELETE : api/posts/:id
//PROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        // 🔍 Récupération du post dans la base de données
        const post = await PostModel.findById(postId);

        if (!post) {
            return next(new HttpError("Post introuvable", 404));
        }

        // 🔐 Vérification que l'utilisateur connecté est bien le créateur du post
        const postCreatorId = post.creator?.toString();
        const requesterId = req.userId?.toString();

        if (postCreatorId != requesterId) {
            return next(new HttpError("Vous ne pouvez pas modifier ce post car vous n'en êtes pas le créateur", 403));
        }


        const deletePost = await PostModel.findByIdAndDelete(postId);
        res.status(200).json(deletePost);

    } catch (error) {
        return next(new HttpError(error));
    }
}

// **************** GET FOLLOWINGS POSTS ***************
// GET : api/posts/following
//PROTECTED
const getFollowingPosts = async (req, res, next) => {
    try {

        const user = await UserModel.findById(req.userId);

        const posts = await PostModel.find({ creator: { $in: user?.following } });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// **************** Like/Dislike POSTS ***************
// GET : api/posts/:id/like
//PROTECTED
const likeDislikePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await PostModel.findById(id);

        let updatedPost;
        if (post?.likes.includes(req.userId)) {
            updatedPost = await PostModel.findByIdAndUpdate(id, { $pull: { likes: req.userId } }, { new: true });
        } else {
            updatedPost = await PostModel.findByIdAndUpdate(id, { $push: { likes: req.userId } }, { new: true });
        }
        res.json(updatedPost);
    } catch (error) {
        return next(new HttpError(error));
    }
}


// **************** GET USER POSTS ***************
// GET : api/users/:id/posts
// PROTECTED
const getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const posts = await UserModel.findById(userId).populate({ path: "posts", options: { sort: { createdAt: -1 } } });
        if (!posts) {
            return next(new HttpError("Aucun post trouvé pour cet utilisateur", 402));
        }
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
}


// **************** CREATE BOOKMARK ***************
// POST : api/posts/:id/bookmark
// PROTECTED
const createBookmark = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 🔍 Récupération du post dans la base de données
        const post = await PostModel.findById(id);

        if (!post) {
            return next(new HttpError("Post introuvable", 404));
        }

        const user = await UserModel.findById(req.userId);
        const postIdBookmarked = user?.bookmarks?.includes(id);
        let userBookmarks;


        if (postIdBookmarked) {
            userBookmarks = await UserModel.findByIdAndUpdate(req.userId, { $pull: { bookmarks: id } }, { new: true });

        } else {
            userBookmarks = await UserModel.findByIdAndUpdate(req.userId, { $push: { bookmarks: id } }, { new: true });
        }
        res.status(200).json(userBookmarks);
    } catch (error) {
        return next(new HttpError(error));
    }
}


// **************** GET BOOKMARK ***************
// POST : api/posts/:id/bookmark
// PROTECTED
const getUserBookmarks = async (req, res, next) => {
    try {        
        const userBookmarks = await UserModel.findById(req.userId).populate({path: "bookmarks", options: {sort: {createdAt: -1}}});

        res.status(200).json(userBookmarks);
    } catch (error) {
        return next(new HttpError(error));
    }
}


module.exports = {
    createPost,
    getPost,
    getPosts,
    updatePost,
    deletePost,
    getFollowingPosts,
    likeDislikePost,
    getUserPosts,
    createBookmark,
    getUserBookmarks,
}
