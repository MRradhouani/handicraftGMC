import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Profiles from './Profiles'

const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('./allpost', {
            headers: {
                "Authorization": "root " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])

    const like = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "root " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)

            }).catch(err => {
                console.log(err)
            })
    }

    const unlike = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "root " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'root ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }


    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "root " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id} >


                        <h5 style={{ padding: "5px" }}><Link to={item.postedBy?._id !== state?._id ? "/profiles/" + item.postedBy?._id : `/profiles/`}>{item.postedBy?.name}</Link> {item.postedBy?._id == state?._id
                                && <i className="material-icons" style={{
                                    float: "right"
                                }}
                                    onClick={() => deletePost(item._id)}
                                >delete</i>

                            }</h5>


                            <div className="card-image">
                                <img alt='some value' src={item.photo} />
                            </div>
                            <div className="card-countent">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {item.like.includes(state._id)
                                    ? <i class="material-icons"
                                        onClick={() => { unlike(item._id) }}

                                    >
                                        thumb_down</i>
                                    :
                                    <i class="material-icons"
                                        onClick={() => { like(item._id) }}
                                    >
                                        thumb_up</i>
                                }


                                <h6>{item.like.length + 1} like </h6>
                                <h6>{item.title} </h6>
                                <p>{item.body} </p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id} > <span style={{ fontWeight: '500' }} > {record.postedBy.name} </span>{record.text}  </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }} >
                                    <input type='text' placeholder="comment" />
                                </form>

                            </div>
                        </div>
                    )
                })
            }

        </div >
    )
}

export default Home 
