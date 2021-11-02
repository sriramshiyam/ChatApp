import { useEffect, useRef, useState } from 'react';
import './chatRoom.css';

function ChatRoom(props) {
    const ref = useRef(null);
    const dummy = useRef(null);
    const [chats, setChats] = useState(true);

    // Automaticaly updates the UI when a change in firestore database
    useEffect(() => {
        const unsubscribe = props.onSnapshot(props.def, (docSnapshot) => {
            if (docSnapshot.exists()) {
                let c = [];
                docSnapshot.data().chat.forEach((chat, index) => {
                    if (index != 0) {
                        if (chat.id != props.user.uid) {
                            c.push(<h3 className="chat" style={{ textAlign: 'left' }}>
                                <img src={chat.photo} />
                                <small style={{ marginLeft: '0.7rem' }} >{chat.name}</small>
                                <br />
                                {chat.message}
                            </h3>);
                        } else if (chat.id == props.user.uid) {
                            c.push(<h3 className="chat" style={{ textAlign: 'right', alignSelf: 'flex-end' }}>
                                <small style={{ marginRight: '0.7rem' }} >{chat.name}</small>
                                <img src={chat.photo} />
                                <br />
                                {chat.message}
                            </h3>);
                        }
                    } else {
                        c.push(<h3 className="chat">{chat.message}</h3>);
                    }
                });
                setChats(c);
                dummy.current.scrollIntoView({ behavior: 'smooth' });
            }
        })

        return () => {
            unsubscribe()
        }

    }, [props.onSnapshot])

    function setMessage() {
        props.sub(ref.current.value);
        ref.current.value = '';
    }

    function sendIcon() {
        return <svg style={{ cursor: 'pointer' }} onClick={setMessage} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M48 448l416-192L48 64v149.333L346 256 48 298.667z"></path></svg>;
    }

    return (
        <>
            <div className="chatroom">
                {chats}
                <div ref={dummy}></div>
            </div>
            <div className="type">
                <input ref={ref} type="text" placeholder="type here . . ." />
                {sendIcon()}
            </div>
        </>
    );
}

export default ChatRoom;