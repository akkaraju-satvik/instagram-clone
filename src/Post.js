import React, { useEffect, useState } from 'react';
import './Post.css';
import firebase from 'firebase';
import { Avatar, Input, Button } from '@material-ui/core';
import { db } from './firebase';

function Post({user, postID, imageURL, userName, caption}) {
    console.log(userName)
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if(postID) {
            unsubscribe = db.collection('posts').doc(postID).collection('comments').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map(doc => doc.data()))
            })
        }

        return () => unsubscribe()
    }, [postID])

    const postComment = function(e) {
        e.preventDefault();
        db.collection('posts').doc(postID).collection('comments').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userName: user.displayName,
            comment: comment
        })

        setComment('');

    }

    return (
        <div className="Post">
            <div className="Post__header">
                <Avatar className="Post__avatar" alt="Satvik" src="/src/images/avatar/1.jpg" />
                <h3>{userName}</h3>
            </div>
            {
                imageURL.split('/')[7].split('?')[0].slice(-3) === "mp4" || imageURL.split('/')[7].split('?')[0].slice(-3) === "mkv" || imageURL.split('/')[7].split('?')[0].slice(-4) === "webm" || imageURL.split('/')[7].split('?')[0].slice(-3) === "mov" ?
                (
                    <video className="Post__video" autoPlay muted controls>
                        <source src={imageURL} type="video/mp4" className="Post__image" alt="VideoPost"/>
                    </video>
                ) :
                (
                    <img src={imageURL} className="Post__image" alt="ImagePost"></img>
                )
            }
            <h4 className="Post__text"><strong>{userName}</strong> {caption}</h4>
            
            <div className="Post__comments">
                <p className="Post__numberOfComments">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</p>
                {
                    comments.map(comment => {
                        return (
                            <p>
                                <strong>{comment.userName}</strong> {comment.comment}
                            </p>
                        )
                    })
                }
            </div>
            <form className="Post__comment">
                <Input className="Post__commentInput" type="text" placeholder="Add a comment"v value={comment} onChange={(e) => setComment(e.target.value)}></Input>
                <Button className="Post__commentButton" disabled={!comment} type="submit" onClick={postComment}>Post</Button>
            </form>

        </div>
    )
}

export default Post
