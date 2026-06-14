import UserContext from "./userContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getInitialTheme = () => {
    const saved = localStorage.getItem("wmx-theme");
    if (saved) return saved;
    return "dark";
};

const UserState = (props) => {
    const navigate = useNavigate()
    const [array, setArray] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([])
    const [projectName, setProjectName] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("wmx-theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");


    //Getting all notes from db
    const API = import.meta.env.VITE_API_URL;

    const getProducts = async () => {
        const response = await fetch(`${API}/products/getproducts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const data = await response.json()
        setArray(Array.isArray(data) ? data : data.products ?? [])
        setLoading(false)
    };

    useEffect(() => {
        getProducts()
    }, [])

    const signUP = async (name, email, password, role = "user") => {
        const endpoint = role === "seller"
            ? `${API}/seller/signup`
            : `${API}/auth/signup`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })
        const data = await response.json()
        if (data.problem === "email") {
            setError({ "email": "Invalid Email Address" })
            setTimeout(() => setError([]), 2000);
        } else if (data.problem === "password") {
            setError({ "password": "Password must be atleast 8 characters" })
            setTimeout(() => setError([]), 2000);
        } else {
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify({ name: data.name, type: role }))
            localStorage.setItem("id", JSON.stringify({ id: data.id }))
            navigate('/')
            return data;
        }
    }

    const login = async (email, password) => {
        const response = await fetch(`${API}/seller/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        const data = await response.json()
        if (data.problem === "email") {
            setError({ "email": "Invalid Email Address" })
            setTimeout(() => setError([]), 2000);
        } else if (data.problem === "password") {
            setError({ "password": "Invalid password" })
            setTimeout(() => setError([]), 2000);
        } else {
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify({ name: data.name, type: "seller" }))
            localStorage.setItem("id", JSON.stringify({ id: data.id }))
            navigate("/")
            return data;
        }
    }

    const getProfile = async () => {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API}/seller/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        return response.json()
    }

    const updateProfile = async (profileData) => {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API}/seller/profile/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify(profileData)
        })
        return response.json()
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

            const response = await fetch(`${API}/products/addproduct`, {
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

            const res = await fetch(`${API}/git/import-repo`, {
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

    const user = JSON.parse(localStorage.getItem("user") || 'null')
    const id = JSON.parse(localStorage.getItem("id") || 'null')
    let userId = id?.id || null
    let firstLetter = user?.name?.[0]?.toUpperCase() || "U"
    let profilePic = user?.profilePic || null
    let userType = user?.type || null

    return (
        <UserContext.Provider value={{ signUP, array, setArray, addProducts, loading, login, getProfile, updateProfile, error, setError, firstLetter, userId, profilePic, userType, theme, toggleTheme }}>
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;