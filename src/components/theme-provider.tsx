"use client";
import { createContext, useContext, useEffect, useState } from "react";
type Theme = "dark"|"light";
const ThemeContext=createContext({theme:"dark" as Theme,toggle:()=>{}});
export function ThemeProvider({children}:{children:React.ReactNode}){const [theme,setTheme]=useState<Theme>("dark");useEffect(()=>{const saved=window.localStorage.getItem("theme") as Theme|null;const next=saved??"dark";document.documentElement.dataset.theme=next;const id=requestAnimationFrame(()=>setTheme(next));return()=>cancelAnimationFrame(id)},[]);const toggle=()=>setTheme(current=>{const next=current==="dark"?"light":"dark";document.documentElement.dataset.theme=next;window.localStorage.setItem("theme",next);return next});return <ThemeContext.Provider value={{theme,toggle}}>{children}</ThemeContext.Provider>}
export const useTheme=()=>useContext(ThemeContext);
