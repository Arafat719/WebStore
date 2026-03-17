import UserContext from "./userContext";
import { useState } from "react";

const UserState = (props) => {

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

    const [array, setarray] = useState([
        {
            "id": "01256325asd412563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01256322632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "0125632541365",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "012563asd25412563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01365336532563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "0265632541365",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01256325412563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01256336532563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01236582632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "012563296832563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "0125258632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01256363652563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "012563558832563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "012569865632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01256625632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01256961632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01256859632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "012568982632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01256362632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01896322632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
        {
            "id": "01656322632563",
            "img": "https://img.freepik.com/free-photo/olden-norway-may-17-2023_58702-16437.jpg?semt=ais_user_personalization&w=740&q=80",
            "caption": "A blog Website",
            "price": "50.00"
        },
    ])

    return (
        <UserContext.Provider value={{ signUP, array, setarray }}>
            {props.children}
        </UserContext.Provider>
    )
}


export default UserState;