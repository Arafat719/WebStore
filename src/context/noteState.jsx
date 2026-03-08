import NoteContext from "./noteContext";

const NoteState = (props) => {

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

    return (
        <NoteContext.Provider value={{ signUP }}>
            {props.children}
        </NoteContext.Provider>
    )
}


export default NoteState;