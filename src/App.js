import { useEffect, useState } from 'react';
import './App.css';
import { auth, db } from './firebase';
import Post from './Post';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
  
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        borderRadius: '10px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {

    const classes = useStyles();

    const [posts, setPosts] = useState([])
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [modalStyle] = useState(getModalStyle);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const [user, setUser] = useState(null);

    useEffect(
        () => {
            const unsubscribe = auth.onAuthStateChanged((authUser) => {
                if(authUser) {
                    //User ==> Logged in
                    // console.log(authUser)
                    setUser(authUser);
                } else {
                    //User ==> Logged Out
                    setUser(null);
                }
            })

            return () => {
                unsubscribe();
            }
        }, [user, username]
    )

    useEffect(
        () => {
            db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => {
                    return {id: doc.id, data: doc.data()};
                }))
            })
        }, 
        []
    )

    const signUp = (e) => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error) => alert(error.message))

        setEmail('');
        setPassword('');
        setOpen(false);

    }

    const signIn = (e) => {
        e.preventDefault(); 
        auth
        .signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message))

        // console.log(user);
        setOpenSignIn(false);
        setEmail('');
        setPassword('');
    }

    return (
        <div className="App">
            <Modal open={open} onClose={() => setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="App__signUp">
                        <center>
                            <img src="https://firebasestorage.googleapis.com/v0/b/instagram-clone-by-satvik.appspot.com/o/Logo%2FLogo.png?alt=media&token=04615a7b-df37-420f-a08c-cbdd563260df" className="App__signUpImage" alt="Instagram Logo"></img>
                        </center>
                        <Input className="App__signUpInput" placeholder="Username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                        <Input className="App__signUpInput" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        <Input className="App__signUpInput" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button type="submit" onClick={signUp}>Sign Up</Button>
                    </form>
                </div>
            </Modal>

            <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="App__signUp">
                        <center>
                            <img src="https://firebasestorage.googleapis.com/v0/b/instagram-clone-by-satvik.appspot.com/o/Logo%2FLogo.png?alt=media&token=04615a7b-df37-420f-a08c-cbdd563260df" className="App__signInImage" alt="Instagram Logo"></img>
                        </center>
                        <Input className="App__signInInput" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        <Input className="App__signInInput" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button type="submit" onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>


            <div className="App__header">
                <img src="https://firebasestorage.googleapis.com/v0/b/instagram-clone-by-satvik.appspot.com/o/Logo%2FLogo.png?alt=media&token=04615a7b-df37-420f-a08c-cbdd563260df" className="App__headerImage" alt="Instagram Logo"></img>
                {user ? 
                    (
                        <div className="App__logout">
                            <p>Welcome { user.displayName ? (user.displayName[0].toUpperCase() + user?.displayName.slice(1)) : ''}</p>
                            <Button onClick={() => auth.signOut()}>Logout</Button>
                        </div>
                    ) :
                    (
                        <div className="App__login">
                            <Button onClick={() => setOpen(true)}>Sign Up</Button>
                            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        </div>
                    )
                }
                

            </div>
            {
                user ? (<ImageUpload userName = {user.displayName}/>) : (<h3 className="App__pleaseLogin">Login to View or Upload</h3>)
            }
            
            {
                user ?
                (
                    <div className="App__posts">
                        {
                            posts.map(
                                ({id, data}) => {
                                    // console.log(data)
                                    return <Post user={user} key={id} postID={id} imageURL={data.imageURL} userName={data.userName} caption={data.caption} />}
                            )
                        }
                    </div>
                ) :
                (
                    <div></div>
                )
            }

        </div>
    );
}

export default App;
