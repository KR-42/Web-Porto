"use client";
import { Moon, Sun } from "lucide-react";import { useTheme } from "./theme-provider";
export function ThemeToggle(){const {theme,toggle}=useTheme();return <button className="icon-button" onClick={toggle} aria-label={`Switch to ${theme==="dark"?"light":"dark"} theme`}>{theme==="dark"?<Sun/>:<Moon/>}</button>}
