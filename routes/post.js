const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const reqLogin = require('../middleware/reqLogin')
const Post = mongoose.model('Post')

router.get('/allpost', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => { res.json({ posts }) })
        .catch(err => { console.log(err) })
})

router.post('/createpost', reqLogin, (req, res) => {
    const { title, body, pic } = req.body
    // console.log(title,body,pic)
    if (!title || !body || !pic) {
        res.status(422).json({ error: "Please add all fields" })
    }
    // console.log(req.user)
    // res.send('ok')
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save()
        .then(result => { res.json({ post: result }) })
        .catch(err => { console.log(err) })
})


router.get('/mypost', reqLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(mypost => { res.json({ mypost }) })
        .catch(err => { console.log(err) })
})

router.put('/like', reqLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { like: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/unlike', reqLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { like: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        } else {
            res.json(result)
        }
    })
})

router.put('/comment', reqLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    }).populate("comments.postedBy", "_id name")
        .populate('postedBy', "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})




router.delete('/deletepost/:postId', reqLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})
module.exports = router