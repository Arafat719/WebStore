import UserContext from "./userContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getInitialTheme = () => {
    const saved = localStorage.getItem("wmx-theme");
    if (saved) return saved;
    return "dark";
};

// Wraps fetch — clears session and redirects to /login on 401
const apiFetch = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return null;
    }
    return response;
};

const UserState = (props) => {
    const navigate = useNavigate()
    const [array, setArray] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([])
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("wmx-theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

    const API = import.meta.env.VITE_API_URL;

    const getProducts = async () => {
        const response = await apiFetch(`${API}/products/getproducts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response) return;
        const data = await response.json();
        setArray(Array.isArray(data) ? data : data.products ?? []);
        setLoading(false);
    };

    useEffect(() => {
        getProducts()
    }, [])

    const signUP = async (name, email, password, role = "user") => {
        const endpoint = role === "seller"
            ? `${API}/seller/signup`
            : `${API}/auth/signup`;
        const response = await apiFetch(endpoint, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        if (!response) return;
        const data = await response.json();
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
        const response = await apiFetch(`${API}/seller/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (!response) return;
        const data = await response.json();
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
        const response = await apiFetch(`${API}/seller/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        });
        if (!response) return null;
        return response.json();
    }

    const updateProfile = async (profileData) => {
        const token = localStorage.getItem('token')
        const response = await apiFetch(`${API}/seller/profile/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": token
            },
            body: JSON.stringify(profileData)
        });
        if (!response) return null;
        return response.json();
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
        githubRepoUrl,
        repoPat,
        livePreviewUrl
    ) => {
        const token = localStorage.getItem('token')
        try {
            setLoading(true);

            if (!githubRepoUrl || !githubRepoUrl.includes("github.com")) {
                setLoading(false);
                return { success: false, message: "Please enter a valid GitHub repo link." };
            }

            const githubRepoName = githubRepoUrl.split("/").filter(Boolean).pop();

            // Step 1: Import repo first
            const importRes = await apiFetch(`${API}/git/import-repo`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "token": token },
                body: JSON.stringify({ githubRepoUrl, repoPat, githubRepoName })
            });
            if (!importRes) {
                setLoading(false);
                return { success: false, message: "Request failed. Please try again." };
            }
            const importData = await importRes.json();
            if (!importRes.ok) {
                setLoading(false);
                return { success: false, message: importData.error || "Failed to import repository." };
            }

            const storedRepoName = importData.storedRepoName;

            // Step 2: Add product with storedRepoName
            const res = await apiFetch(`${API}/products/addproduct`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "token": token },
                body: JSON.stringify({
                    title, images, description, price, repoName: storedRepoName,
                    githubRepoUrl, livePreviewUrl, tags, builtWith, features,
                    documentation, support, previewLink
                })
            });
            if (!res) {
                setLoading(false);
                return { success: false, message: "Request failed. Please try again." };
            }
            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                setArray(prev => [...prev, data]);
                return { success: true, message: "Project uploaded successfully!" };
            } else {
                return { success: false, message: data.error || "Something went wrong." };
            }
        } catch (error) {
            setLoading(false);
            return { success: false, message: "Server error. Please try again." };
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
