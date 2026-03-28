import UserContext from "./userContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserState = (props) => {
    const navigate = useNavigate()
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
        const data = await response.json()
        if (data.problem === "email") {
            seterror({ "email": "Invelid Email Address" })
            setTimeout(() => {
                seterror([])
            }, 2000);
        } else if (data.problem === "password") {
            seterror({ "password": "Password must be atleast 8 characters" })
            setTimeout(() => {
                seterror([])
            }, 2000);
        } else {
            localStorage.setItem("token", data.token)
            navigate('/')
            return data;
        }
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
        if (data.problem === "email") {
            seterror({ "email": "Invelid Email Address" })
            setTimeout(() => {
                seterror([])
            }, 2000);
        } else if (data.problem === "password") {
            seterror({ "password": "Invelid password" })
            setTimeout(() => {
                seterror([])
            }, 2000);
        } else {
            localStorage.setItem("token", data.token)
            navigate("/")
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
        // projectName,
        // repoUrl

    ) => {

        const response = await fetch("http://localhost:5000/products/addproduct", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
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


        // if (!projectName || !repoUrl) {
        //     alert("All fields are required!");
        //     return;
        // }

        // if (!repoUrl.includes("github.com")) {
        //     alert("Please enter a valid GitHub repo link");
        //     return;
        // }

        try {
            setLoading(true);

            // const res = await fetch("http://localhost:5000/import-repo", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({ projectName, repoUrl })
            // });

            // const data = await res.json();

            // if (res.ok) {
            //     alert("✅ Project uploaded successfully!");
            //     setProjectName("");
            //     setRepoUrl("");
            // } else {
            //     alert(data.error || "❌ Something went wrong");
            // }

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
                    documentation,)
        } catch (error) {
            console.error(error);
            alert("Server error");
        }

        const json = await response.json();

        // 🔥 safely add to state
        if (response.ok) {
            setarray(prev => [...prev, json]);
        } else {
            console.error("Error:", json);
        }
    };


    return (
        <UserContext.Provider value={{ signUP, array, setarray, addProducts, loading, login, error, seterror }}>
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;