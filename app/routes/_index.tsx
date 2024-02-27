import type { MetaFunction } from "@remix-run/node";

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
        <h1>Remix Chat</h1>
    </div>
  );
}

/* export const action = ({request}) => {
  const uiid = v4();
  return redirect("/chat/" + uiid);
} */
