import { useState, useEffect } from "react";

interface UseDarkModeReturn {

    isDark: boolean;
    toggle: () => void;
}

export function useDarkMode() {

    const [isDark, setIsDark] = useState<boolean>(() => {

        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {

        if (isDark) {

            document.documentElement.classList.add("dark");
        } else {

            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", String(isDark));
    }, [isDark]);

    const toggle = () => setIsDark((prev) => !prev);

    return { isDark, toggle };
}