import { Link, useLoaderData, Form } from "@remix-run/react";
import { getSession } from "~/services/session";

export default function Sidebar({ chat }) {
    
    return (
        <div style={{ width: "200px", height: "100%", backgroundColor: "#f0f0f0", padding: "20px" }}>
            <h3>Remix Chat</h3>
            <Form method="post">
                <button type="submit">
                    New
                </button>
            </Form>
            <ul style={{ listStyle: "none", padding: 0 }}>
                <li><Link to="/">Home</Link></li>
                {
                    chat?.map((chat, i) => {
                        return (
                            <li key={i}>
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