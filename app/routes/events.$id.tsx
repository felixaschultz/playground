import { con } from "~/db/database";

export const loader = async ({params, request}) => {

    const id = params.id;

    const [chat] = await con.query(`SELECT * FROM messages WHERE chat_id = ?`, [id]);
    
    return chat;
}