import NoteContext from "./noteContext";

const NoteState = (props) => {

    return (
        <NoteContext.Provider value={{ name }}>
            {props.children}
        </NoteContext.Provider>
    )
}


export default NoteState;