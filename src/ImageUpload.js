import React, { useState } from 'react';
import { Button, Input } from '@material-ui/core';
import { db, storage } from './firebase';
import './ImageUpload.css'
import firebase from 'firebase';
import { Modal } from '@material-ui/core';

function ImageUpload({userName}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [openUpload, setOpenUpload] = useState(false);
    const [contentType, setContentType] = useState('')
    const handleChange = function(e) {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = function() {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on("state_changed", (snapshot) => {
            // Visual Effect
            const progress = Math.round(
                snapshot.bytesTransferred / snapshot.totalBytes * 100
            );
            setProgress(progress);
        },
        (error) => {
            console.log(error.message);
        },
        () => {
            storage.ref('images').child(image.name).getMetadata().then(metadata => {
                setContentType(metadata.contentType);
                // console.log(contentType)
            })
            storage.ref('images').child(image.name).getDownloadURL().then(url => {
                // console.log(contentType)
                db.collection('posts').add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageURL: url,
                    contentType: contentType ,
                    userName: userName
                });
                
                setProgress(0);
                setCaption('');
                setOpenUpload(false);
            })
        });
    }
    console.log(userName)
    return (
        <>
            <div className="ImageUpload__container">
                <Modal className="Modal" open={openUpload} onClose={() => setOpenUpload(false)}>
                    <div className="ImageUpload">
                        <progress className="ImageUpload__progress" value={progress} max="100"></progress>
                        <Input className="ImageUpload__caption" value={caption} placeholder="Enter a caption" onChange={(e) => setCaption(e.target.value)} type="text" />
                        <Input className="ImageUpload__file" type="file" onChange={handleChange} />
                        <Button disabled={!image} onClick={handleUpload}>Upload</Button>
                        <Button onClick={() => setOpenUpload(false)}>Discard</Button>
                    </div>
                </Modal>
            </div>
            <Button className="ImageUpload__open" click onClick={() => setOpenUpload(true)}>Create a Post</Button>
        </>
    )
}

export default ImageUpload
