import { redirect } from "@remix-run/react";
import { useLoaderData, useFetcher, Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { getSession } from "~/services/session";

import moment from "moment";
import con from "~/db/database";

import "../Styles/chat.css";

export const meta = () => {
    return [
        { title: "Chat" },
        { name: "description", content: "Welcome to Remix!" },
    ];
}

export const loader = async ({ params, request }) => {
    const session = await getSession(request.headers.get("cookie"));
    const user = session.data.username;

    if(session.data.login === false){
        return redirect("/login");
    }

    if (!params?.id) {
        return redirect("/");
    }
    const id = params.id;

    const [chat] = await con.query("SELECT * FROM messages WHERE chat_id = ?", [id]);
    chat.forEach((message) => {
        message.you = message.user === user;
    });

    return { user: user, chat: chat };
}

export default function Chat() {
    const {user, chat} = useLoaderData();
    const fetcher = useFetcher();
    let textRef = useRef();

    useEffect(() => {
        if (fetcher.state === "submitting" && textRef.current) {
            textRef.current.value = "";
            textRef.current.focus();
        }
    }, [fetcher.state])

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <header className="chat-header">
                <h1>{user}</h1>
            </header>
            <section>
                {chat.map((message, i) => {
                    // Calculate the difference in seconds between the current message's date and the previous message's date
                    const secondsDiff = i > 0 ? moment(message.date).diff(moment(chat[i - 1].date), 'seconds') : 0;
                    const you = (message.you) ? " right" : "";
                    const lessThan60Seconds = (secondsDiff <= 60) ? " mt-small " : "";

                    return (
                        <div key={i} className={"bubble" + you}>
                            {message.message}
                        </div>
                    )
                })}
            </section>
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
    return await con.query("INSERT INTO messages (chat_id, user, message, date) VALUES (?, ?, ?, ?)", [params.id, username, message, new Date()]);
}
