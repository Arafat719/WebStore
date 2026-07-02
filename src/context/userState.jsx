import UserContext from "./userContext";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TOAST_REMINDER_INTERVAL = 5 * 60 * 1000;
const TOAST_AUTO_DISMISS = 8000;

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
    const [userVersion, setUserVersion] = useState(0)
    const [theme, setTheme] = useState(getInitialTheme);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toastNotif, setToastNotif] = useState(null);
    const prevUnreadCountRef = useRef(0);
    const unreadCountRef = useRef(0);
    const notificationsRef = useRef([]);
    const toastTimeoutRef = useRef(null);

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

    const signUP = async (name, email, password) => {
        const response = await apiFetch(`${API}/auth/signup`, {
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
            localStorage.setItem("user", JSON.stringify({ name: data.name, type: data.type ?? "user", roles: data.roles ?? ["buyer"], profilePic: data.profilePic ?? "" }))
            localStorage.setItem("id", JSON.stringify({ id: data.id }))
            fetchNotifications();
            navigate('/')
            return data;
        }
    }

    const login = async (email, password) => {
        const response = await apiFetch(`${API}/auth/login`, {
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
        } else if (data.problem === "blocked") {
            setError({ "blocked": data.error })
        } else {
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify({ name: data.name, type: data.type ?? "user", roles: data.roles ?? ["buyer"], profilePic: data.profilePic ?? "" }))
            localStorage.setItem("id", JSON.stringify({ id: data.id }))
            fetchNotifications();
            navigate("/")
            return data;
        }
    }

    const showToast = (notif) => {
        setToastNotif(notif);
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => setToastNotif(null), TOAST_AUTO_DISMISS);
    };

    const dismissToast = () => {
        clearTimeout(toastTimeoutRef.current);
        setToastNotif(null);
    };

    const fetchNotifications = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await apiFetch(`${API}/notifications`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "token": token,
                },
            });
            if (!res) return;
            const data = await res.json();
            const newNotifications = data.notifications || [];
            const newUnreadCount = data.unreadCount || 0;
            setNotifications(newNotifications);
            setUnreadCount(newUnreadCount);

            if (newUnreadCount > prevUnreadCountRef.current) {
                const latestUnread = newNotifications.find(n => !n.read);
                if (latestUnread) showToast(latestUnread);
            }
            prevUnreadCountRef.current = newUnreadCount;
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const markNotificationRead = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            await apiFetch(`${API}/notifications/${id}/read`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": token,
                },
            });
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => {
                const next = Math.max(0, prev - 1);
                prevUnreadCountRef.current = next;
                return next;
            });
            setToastNotif(prev => (prev?._id === id ? null : prev));
        } catch (err) {
            console.error("Failed to mark notification read:", err);
        }
    };

    const markAllNotificationsRead = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            await apiFetch(`${API}/notifications/read-all`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": token,
                },
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
            prevUnreadCountRef.current = 0;
            dismissToast();
        } catch (err) {
            console.error("Failed to mark all notifications read:", err);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) fetchNotifications();
        const interval = setInterval(() => {
            if (localStorage.getItem("token")) fetchNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => { unreadCountRef.current = unreadCount; }, [unreadCount]);
    useEffect(() => { notificationsRef.current = notifications; }, [notifications]);

    // Re-show the latest unread notification as a reminder every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (!localStorage.getItem("token")) return;
            if (unreadCountRef.current > 0) {
                const latestUnread = notificationsRef.current.find(n => !n.read);
                if (latestUnread) showToast(latestUnread);
            }
        }, TOAST_REMINDER_INTERVAL);
        return () => clearInterval(interval);
    }, []);

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
        livePreviewUrl,
        license
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
                    title, images, description, price, storedRepoName,
                    githubRepoUrl, livePreviewUrl, tags, builtWith, features,
                    documentation, support, previewLink, license
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
                return { success: true, message: "Project uploaded successfully!", productId: data._id };
            } else {
                return { success: false, message: data.error || "Something went wrong." };
            }
        } catch (error) {
            setLoading(false);
            return { success: false, message: "Server error. Please try again." };
        }
    };

    const becomeSeller = async () => {
        const token = localStorage.getItem('token');
        const response = await apiFetch(`${API}/auth/become-seller`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "token": token }
        });
        if (!response) return { success: false };
        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem("token", data.token);
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem("user", JSON.stringify({ ...stored, roles: data.roles ?? ["buyer", "seller"] }));
            setUserVersion(v => v + 1);
            return { success: true, data };
        }
        return { success: false, data };
    };

    const { user, userId, firstLetter, profilePic, userType, userRoles } = useMemo(() => {
        const u = JSON.parse(localStorage.getItem("user") || 'null');
        const idObj = JSON.parse(localStorage.getItem("id") || 'null');
        return {
            user: u,
            userId: idObj?.id || null,
            firstLetter: u?.name?.[0]?.toUpperCase() || "U",
            profilePic: u?.profilePic || null,
            userType: u?.type || null,
            userRoles: u?.roles ?? ["buyer"],
        };
    }, [userVersion]);

    return (
        <UserContext.Provider value={{ signUP, array, setArray, addProducts, loading, login, getProfile, updateProfile, error, setError, firstLetter, userId, profilePic, userType, userRoles, becomeSeller, theme, toggleTheme, notifications, unreadCount, fetchNotifications, markNotificationRead, markAllNotificationsRead, toastNotif, dismissToast, setUserVersion }}>
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;
