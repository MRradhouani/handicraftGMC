import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from "react-router-dom"
import { UserContext } from "../App"
import M from 'materialize-css'
const Navbar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails,setUserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const history = useHistory()
    const renderList = () => {
        if (state) {
            return [
                <li key="1"> <i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,

                <li key="2"><Link to="/Profiles">profile</Link></li>,
                <li key="3"><Link to="/CreatePost">Create New Post </Link></li>,
                <li key="4"> <button className="btn waves-effect waves-light .#64b5f6 red"
                    onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        history.push('/Login')
                    }}
                >
                    LogOut
            </button>
                </li>

            ]
        }
        else {
            return [
                <li key="5"><Link to="/Login">Signin</Link></li>,
                <li key="7"><Link to="/Signup">signup</Link></li>

            ]
        }
    }

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
     }
    return (
        <nav>
            <div className="nav-wrapper white" style={{ color: "black" }}>
                <Link to={"/"} className="brand-logo left">Handicraft</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}
                </ul>
            </div>

            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">

                <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
                    <ul className="collection">
                        {userDetails.map(item => {
                            return <Link to={item?._id !== state?._id ? "/profiles/"+item._id:'/profiles'} onClick={()=>{
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                              }}><li className="collection-item">{item.email}</li></Link> 
                        })}
                    </ul>

                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
                </div>
            </div>
        </nav >
    )
}

export default Navbar