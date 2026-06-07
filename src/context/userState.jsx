import UserContext from "./userContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserState = (props) => {
    const navigate = useNavigate()
    const [array, setArray] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([])
    const [projectName, setProjectName] = useState("");
    const [repoUrl, setRepoUrl] = useState("");


    //Getting all notes from db
    const getProducts = async () => {
        const response = await fetch("https://webmarketbackend.onrender.com/products/getproducts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await response.json()
        setArray(data)
        setLoading(false)
    };

    useEffect(() => {
        getProducts()
    }, [])

    const signUP = async (name, email, password) => {
        const response = await fetch("https://webmarketbackend.onrender.com/auth/signup", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password })
        })
        const text = await response.text()
        console.log(text)
        if (data.problem === "email") {
            setError({ "email": "Invalid Email Address" })
            setTimeout(() => {
                setError([])
            }, 2000);
        } else if (data.problem === "password") {
            setError({ "password": "Password must be atleast 8 characters" })
            setTimeout(() => {
                setError([])
            }, 2000);
        } else {
            localStorage.setItem("token", data.token)
            navigate('/')
            console.log(data)
            return data;
        }
    }

    const login = async (email, password) => {
        const response = await fetch("https://webmarketbackend.onrender.com/auth/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        })
        const data = await response.json()
        if (data.problem === "email") {
            setError({ "email": "Invalid Email Address" })
            setTimeout(() => {
                setError([])
            }, 2000);
        } else if (data.problem === "password") {
            setError({ "password": "Invalid password" })
            setTimeout(() => {
                setError([])
            }, 2000);
        } else {
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify({
                name: data.name,
            }))
            localStorage.setItem("id", JSON.stringify({
                id: data.id
            }))
            navigate("/")
            console.log(data.id)

            return data;
        }
    }
    const addProducts = async (
        images,
        title,
        description,
        price,
        previewLink,
        tags,
        builtWith,
        features,
        support,
        documentation,
        projectName,
        repoUrl

    ) => {
        const token = localStorage.getItem('token')
        try {
            setLoading(true);

            if (!projectName || !repoUrl) {
                alert("All fields are required!");
                return;
            }

            if (!repoUrl.includes("github.com")) {
                alert("Please enter a valid GitHub repo link");
                return;
            }

            const response = await fetch("https://webmarketbackend.onrender.com/products/addproduct", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({
                    images,
                    title,
                    description,
                    price,
                    previewLink,
                    tags,
                    builtWith,
                    features,
                    support,
                    documentation
                })
            });

            const res = await fetch("https://webmarketbackend.onrender.com/git/import-repo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({ projectName, repoUrl })
            });

            const data = await res.json();
            const json = await response.json();
            setLoading(false);

            if (res.ok && response.ok) {
                alert("✅ Project uploaded successfully!");
                setArray(prev => [...prev, json]);
                setProjectName("");
                setRepoUrl("");
            } else {
                alert(data.error || "❌ Something went wrong");
            }

            console.log(
                images,
                title,
                description,
                price,
                previewLink,
                tags,
                builtWith,
                features,
                support,
                documentation,
                projectName,
                repoUrl
            );
        } catch (error) {
            console.error(error);
            alert("Server error");
            setLoading(false);
        }
    };

    const user = JSON.parse(localStorage.getItem("user"))
    const id = JSON.parse(localStorage.getItem("id"))
    // let userId = id.id
    let userId = 2
    // console.log(id)
    // let firstLetter = user.name

    let firstLetter = 2

    return (
        <UserContext.Provider value={{ signUP, array, setArray, addProducts, loading, login, error, setError, firstLetter, userId }}>
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;