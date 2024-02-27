import { Link, useLoaderData, Form } from "@remix-run/react";
import { getSession } from "~/services/session";
import "./Style.css";
export default function Sidebar({ chat }) {
    
    return (
        <div style={{ width: "250px", height: "100%", backgroundColor: "#f0f0f0" }}>
            <header className="settings">
                <h3 className="logo">Remix Chat</h3>
                <Form method="post">
                    <button className="cta" type="submit">
                        New Chat
                    </button>
                </Form>
            </header>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {
                    chat?.map((chat, i) => {
                        return (
                            <li className="chats" key={i}>
                                <Link to={`/chat/${chat.chat_id}`}>
                                    {chat.user}: 
                                    {chat.message}
                                </Link>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}