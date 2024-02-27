import { redirect } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import con from "~/db/database";

export const loader = async ({ params, request }) => {
    if (!params?.id) {
        return redirect("/");
    }
    const id = params.id;
    const [rows] = await con.execute("SELECT * FROM chats WHERE id = ?", [id]);
    if (rows.length === 0) {
        const [result] = await con.execute("INSERT INTO chats (id) VALUES (?)", [id]);
    }

    return { date: new Date(), id: params?.id};
}

export default function Chat() {
    const data = useLoaderData();
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <h1>Remix Chat</h1>
            <p>{data.id}</p>
        </div>
    );
}

