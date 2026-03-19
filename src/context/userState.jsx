import UserContext from "./userContext";
import { useState, useEffect } from "react";

const UserState = (props) => {

    const [array, setarray] = useState([])

    //Getting all notes from db
    const getProducts = async () => {
        const response = await fetch("http://localhost:5000/products/getproducts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await response.json()
        setarray(data)
    };

    useEffect(() => {
      getProducts()
    }, [])
    

    const signUP = async (name, email, password) => {
        const response = await fetch("http://localhost:5000/auth/createuser", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password })
        })
        const json = await response.json()
        localStorage.setItem("token", json)
        return json;
    }

    const addProducts = async (title, img, description, price) => {
        const response = await fetch("http://localhost:5000/products/addproduct", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, img, description, price })
        })
        const json = await response.json();
        console.log(json)
        return json;
    }


    return (
        <UserContext.Provider value={{ signUP, array, setarray, addProducts }}>
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;