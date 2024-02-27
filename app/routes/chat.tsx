import { useLoaderData } from "@remix-run/react";
import { con } from "../db/database";
import { redirect } from "@remix-run/node";

export async function loader({ request }) {
    if(!request.params?.id) return redirect("/");
    const message = await con.execute("SELECT * FROM messages WHERE id = ?", [request.params?.id]);
    return { date: new Date() };
}

export default function Chat() {
    const data = useLoaderData();
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1>Remix Chat</h1>
        <p>Chat coming soon!</p>
        </div>
    );
}