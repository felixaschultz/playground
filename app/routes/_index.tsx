import type { MetaFunction } from "@remix-run/node";
import Sidebar from "~/components/sidebar";
import { redirect } from "@remix-run/node";
import { v4 } from "uuid";

export const meta: MetaFunction = () => {
  return [
    { title: "Chat" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export function loader() {
  return { date: new Date() };
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <Sidebar />
    </div>
  );
}

export const action = ({request}) => {
  const uiid = v4();
  return redirect("/chat/" + uiid);
}
