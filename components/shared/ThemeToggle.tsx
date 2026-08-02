"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initialize theme from local storage or system preference
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    // Avoid hydration mismatch by not rendering anything until mounted
    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="rounded-full opacity-0">
                <Sun className="h-5 w-5" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full cursor-pointer">
            {isDark ? (
                <Moon className="h-5 w-5 text-slate-300 hover:text-white" />
            ) : (
                <Sun className="h-5 w-5 text-slate-600 hover:text-slate-900" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
