import { redirect } from "@remix-run/react";
import { useLoaderData, useFetcher, Form } from "@remix-run/react";

import moment from "moment";
import con from "~/db/database";

import "../Styles/chat.css";

export const loader = async ({ params, request }) => {
    if (!params?.id) {
        return redirect("/");
    }
    const id = params.id;
    /* const [rows, fields] = await con.query("SELECT * FROM chats WHERE id = ?", [id]);

    console.log(rows, id);

    if (rows.length === 0) {
        const [result] = await con.query("INSERT INTO chats (id) VALUES (?)", [id]);

        if (result.affectedRows === 0) {
            return redirect("/");
        }
    } */
    const user = "Felix";
    const chat = [
        {
            user: "Felix",
            message: "Hello",
            date: new Date("2021-10-10 10:57:00"),
            you: true
        },
        {
            user: "John",
            message: "Hi",
            date: new Date("2021-10-10 11:58:00")
        },
        {
            user: "Felix",
            message: "How are you?",
            date: new Date("2021-10-10 11:55:00"),
            you: true
        },
        {
            user: "John",
            message: "I'm good, you?",
            date: new Date("2021-10-10 12:00:00")
        },
        {
            user: "John",
            message: "What are you plans for today?",
            date: new Date("2021-10-10 12:00:01")
        },
        {
            user: "Felix",
            message: "How are you?",
            date: new Date("2021-10-10 12:01:00"),
            you: true
        },
    ]

    return { user: user, chat: chat };
}

export default function Chat() {
    const {user, chat} = useLoaderData();
    const fetcher = useFetcher();
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
                        <input type="text" name="message" placeholder="Type a message" />
                        <button type="submit">Send</button>
                    </fieldset>
                </fetcher.Form>
            </footer>
        </div>
    );
}

export const action = async ({ params, request }) => {
    const data = await request.formData();
    const message = data.get("message");
    if (!message) {
        return redirect("/chat/" + params.id);
    }
    return await con.query("INSERT INTO messages (chat_id, user, message, date) VALUES (?, ?, ?, ?)", [params.id, "Felix", message, new Date()]);
}
