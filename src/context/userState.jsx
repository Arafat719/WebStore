import UserContext from "./userContext";
import { useState, useEffect } from "react";

const UserState = (props) => {
    const [array, setarray] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, seterror] = useState([])

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
        setLoading(true)
    };

    useEffect(() => {
        getProducts()
    }, [])

    const signUP = async (name, email, password) => {
        const response = await fetch("http://localhost:5000/auth/signup", {
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

    const login = async (email, password) => {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        })
        const data = await response.json()
        if(data.problem === "email") {
            seterror({"email": "Invelid Email Address"})
            setTimeout(() => {
                seterror([])
            }, 2000);
        } else if(data.problem === "password") {
            seterror({"password": "Invelid password"})
            setTimeout(() => {
                seterror([])
            }, 2000);
        }
        localStorage.setItem("token", data)
        console.log(data)
        return data;
    }

    const addProducts = async (img, title, description, price) => {
        const response = await fetch("http://localhost:5000/products/addproduct", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ img, title, description, price })
        })
        const json = await response.json();
        setarray(prev => [...prev, json])
    }


    return (
        <UserContext.Provider value={{ signUP, array, setarray, addProducts, loading, login, error }}>
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;