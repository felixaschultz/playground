import con from "~/db/database";
import { Form, useActionData} from "@remix-run/react";
import { commitSession, getSession } from "~/services/session";
import { redirect } from "@remix-run/node";

export default function Login() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1>Login</h1>
        <Form method="post">
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
            </div>
            <button type="submit">Login</button>
        </Form>
    </div>
  );
}

export const action = async ({request}) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

   /*  if(!username || !password){
        return new Response("Invalid username or password", {status: 400}); 
    } */
    
    let session = await getSession();
        session.set("login", true);
        session.set("username", username);
        await commitSession(session);
    
        return redirect("/", {
            headers: {
              "Set-Cookie": await commitSession(session)
            },
        });
};