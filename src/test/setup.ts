import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);
class IntersectionObserverMock implements IntersectionObserver {
  readonly root=null;readonly rootMargin="0px";readonly scrollMargin="0px";readonly thresholds=[0];
  disconnect(){} observe(){} takeRecords(){return []} unobserve(){}
}
globalThis.IntersectionObserver=IntersectionObserverMock;
const storage=new Map<string,string>();
Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>storage.set(key,value),removeItem:(key:string)=>storage.delete(key),clear:()=>storage.clear(),key:(index:number)=>[...storage.keys()][index]??null,get length(){return storage.size}}});
