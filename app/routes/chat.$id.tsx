import { useLoaderData, useFetcher, Form, redirect, useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { getSession } from "~/services/session";
import { useRevalidator } from "@remix-run/react";

import moment from "moment";
import { con } from "~/db/database";
import { eventStream, emitter } from "~/services/event.server";
import MessageContainer from "~/components/MessageContainer";
import "../Styles/chat.css";

export const meta = () => {
    return [
        { title: "Chat" },
        { name: "description", content: "Welcome to Remix!" },
    ];
}

export const loader = async ({ params, request }) => {
    const session = await getSession(request.headers.get("cookie"));
    const signedInUser = session.data.username;

    if(session.data.login === false){
        return redirect("/login");
    }

    if (!params?.id) {
        return redirect("/");
    }
    const id = params.id;

    let [chat] = await con.query("SELECT * FROM messages WHERE chat_id = ?", [id]);

    if(!chat){
        return new Response("Chat not found", {status: 404});
    }

    chat = chat.map((message) => {
        message.date = moment(message.date).format("YYYY-MM-DD HH:mm:ss");
        return message;
    });

    chat.forEach((message) => {
        /* Find user */
        (message.message.match(/@(\w+)/g) || []).forEach((match) => {
            const username = match.slice(1);
            message.message = message.message.replace(match, `<a href="/chat/${id}/@${username}">${match}</a>`);
        });

        /* Find YouTube Videos */
        (message.message.match(/https:\/\/www.youtube.com\/watch\?v=(\w+)/g) || []).forEach((match) => {
            const videoId = match.split("v=")[1];
            message.message = message.message.replace(match, `<iframe width="720" height="auto" style="aspect-ratio: 16/9;" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
        });

        message.you = message.user === signedInUser;
    });

    const chatUser = chat.find(element => element.user !== signedInUser)?.user;
    return { chat, chatUser };
}

export default function Chat() {
    const {chat, user} = useLoaderData();
    const revalidator = useRevalidator();
    
    const fetcher = useFetcher();
    let textRef = useRef();
    let chatRef = useRef();

    useEffect(() => {
        if (fetcher.state === "submitting" && textRef.current) {
            textRef.current.value = "";
            textRef.current.focus();
        }

        if(fetcher.state === "done" && chatRef.current){
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }

    }, [fetcher.state]);

    useEffect(() => {
        const handleNewMessage = (data) => {
            console.log(data);
            revalidator.revalidate();
        };
    
        if( emitter ){
            emitter.on("after_message_insert", handleNewMessage);
            return () => {
                emitter.off("after_message_insert", handleNewMessage);
            }
        }else{
            console.log("No emitter");
        }
    }, []); // Empty dependency array

    return (
        <div className="chatContainer-grid" style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <header className="chat-header">
                <h1>{ user }</h1>
            </header>
            <MessageContainer messages={chat} ref={chatRef} />
            <footer>
                <fetcher.Form method="post">
                    <fieldset disabled={fetcher.state === "submitting" ? true : false}>
                        <section className="chatContainer">
                            <input className="chat-input" ref={textRef} type="text" name="message" placeholder="Type a message" />
                        </section>
                    </fieldset>
                </fetcher.Form>
            </footer>
        </div>
    );
}

export const action = async ({ params, request }) => {
    const session = await getSession(request.headers.get("cookie"));

    if(!session.data.login){
        return redirect("/login");
    }

    const data = await request.formData();
    const message = data.get("message");
    const username = session.data.username;
    if (!message) {
        return redirect("/chat/" + params.id);
    }

    const newMessage = await con.query("INSERT INTO messages (chat_id, user, message, date) VALUES (?, ?, ?, ?)", [params.id, username, message, new Date()]);

    if(newMessage){
        return emitter.emit("after_message_insert", { chat_id: params.id, user: username, message: message, date: new Date() });
    }
}
