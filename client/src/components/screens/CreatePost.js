import React, { useState, useEffect } from 'react'
import M from "materialize-css"
import { useHistory } from 'react-router-dom'
const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, seturl] = useState("")
    useEffect(() => {
        if (url) {



            fetch('/createpost', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "root " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })

            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: '#e53935 red darken-1' })
                    }
                    else {
                        M.toast({ html: 'created post Successlly', classes: '#69f0ae green accent-2' })
                        history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const postDetails = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append('cloud_name', "daardfpre")
        fetch("https://api.cloudinary.com/v1_1/daardfpre/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                seturl(data.url)
            })
            .catch(err => {
                console.log(err)
            })


    }
    return (
        <div className="card input-filed"
            style={{
                margin: "30px auro",
                padding: "20px",
                maxWidth: '500px',
                textAlign: 'center'
            }}
        >
            <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}

            />

            <div className="file-field input-field">
                <div className="btn">
                    <span >Upload image</span>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button class="btn waves-effect waves-light .#64b5f6 blue darken-1"
                onClick={() => postDetails()}
            >
                Submit Post
                </button>
        </div>
    )
}

export default CreatePost
