import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

const Profiles = () => {
    const [mypics, setPics] = useState([])
    const [profile, setProdile] = useState(null)
    const [url, setUrl] = useState("")
    const [image, setImage] = useState('')
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "root " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setPics(result.mypost)
            })
    }, [])


    useEffect(() => {
        if(image){
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
                    setUrl(data.url)
                    console.log(data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        
    }, [image])


    const updatePhoto = (file) => {
        setImage(file)
      
    }
    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: '1px solid grey'
            }}>
                <div>
                    <img alt=" " style={{ width: "160px", height: '160px', borderRadius: "80px" }}
                        src={state ? state.pic : "loading"} />


                    <div className="file-field input-field">
                        <div className="btn">
                            <span >Upload image</span>
                            <input
                                type="file" 
                                onChange={(e) => updatePhoto(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>

                </div>
                <div>
                    <h4>{state ? state.name : "loading"} </h4>
                    <h5>{state ? state?.email : "loading"} </h5>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "110%"
                    }}>
                        <h6> {profile?.posts?.length} posts</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }

            </div>
        </div>
    )
}

export default Profiles
