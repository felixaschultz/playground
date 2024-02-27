import { redirect } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
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
            you: true
        },
        {
            user: "John",
            message: "Hi"
        }
    ]

    return { user: user, chat: chat };
}

export default function Chat() {
    const {user, chat} = useLoaderData();

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <h1>Chat: {user}</h1>
            <h2>Messages</h2>
            <ul>
                {chat.map((message, i) => (
                    <li key={i} className={(message.you) ? "bubble right" : "bubble"}>
                        {message.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

