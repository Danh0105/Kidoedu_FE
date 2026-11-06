import { useState } from "react";
import LoadPage from "../hooks/LoadPage";
import Home from "../pages/user/Home";

export default function HomeWithLoadOnce() {
    const [loaded, setLoaded] = useState(
        () => sessionStorage.getItem("HOME_LOADED") === "true"
    );

    const handleHomeLoaded = () => {
        sessionStorage.setItem("HOME_LOADED", "true");
        setLoaded(true);
    };

    return (
        <>
            {!loaded && <LoadPage />}
            <Home onLoaded={handleHomeLoaded} />
        </>
    );
}
