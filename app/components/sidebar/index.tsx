import { Link } from "@remix-run/react"
import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";

export default function Sidebar() {
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
                <li><Link to="/chat/1">Chat 1</Link></li>
                <li><Link to="/chat/2">Chat 2</Link></li>
                <li><Link to="/chat/3">Chat 3</Link></li>
            </ul>
        </div>
    );
}