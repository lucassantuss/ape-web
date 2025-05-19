import { Outlet } from "react-router-dom";

export default function DefaultPage() {
    return (
        <main>
            <Outlet />
        </main>
    )
}