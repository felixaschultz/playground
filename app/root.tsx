import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import "./Styles/global.css";
import {con} from "~/db/database";
import { v4 } from "uuid";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Sidebar from "~/components/sidebar";
import { getSession } from "~/services/session";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({request}) => {
  const user = await getSession(request.headers.get("cookie"));
  const [chat] = await con.query(`SELECT m.*
  FROM messages m
  INNER JOIN (
      SELECT chat_id, MAX(date) AS max_date
      FROM messages
      GROUP BY chat_id
  ) group_m ON m.chat_id = group_m.chat_id AND m.date = group_m.max_date
  ORDER BY date DESC
  LIMIT 10`);

  return { chat };
}

export default function App() {
  const { chat, user } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="grid grid-col-min-2">
          <header>
            <Sidebar chat={chat} />
          </header>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const action = ({request}) => {
  const uiid = v4();
  return redirect("/chat/" + uiid);
}

export function ErrorBoundary({ error }) {

  return (
    <div role="alert">
      <h1>An error occurred</h1>
      <pre>{error}</pre>
    </div>
  );
}
