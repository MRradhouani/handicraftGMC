import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'


const Profiles = () => {
    const [profile, setProdile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    console.log(userid)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "root " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setProdile(result)

            })
    }, [])

    return (
        <>
            {profile ?
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: '1px solid grey'
                    }}>
                        <div>
                            <img alt=" " style={{ width: "160px", height: '160px', borderRadius: "80px" }}
                        src={profile.user?.pic} />
                        />
                        </div>
                        <div>

                            <h4>{profile.user?.name} </h4>
                            <h5>{profile.user?.email} </h5>
                            <h4>{profile.user?.craft} </h4>


                            <div style={{ display: "flex", justifyContent: "space-between", width: "110%" }}>
                                <h6> {profile.posts?.length} posts</h6>
                            </div>
                        </div>
                    </div>
                    <div className="gallery">
                        {
                            profile.posts?.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }

                    </div>
                </div>

                :
                <h3> loadding.......!</h3>

            }


        </>

    )
}

export default Profiles
