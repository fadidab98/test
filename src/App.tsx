import React from "react";
function formatCount(value: number) { return value.toFixed(0); }
export function App() { return <main>{formatCount("five")}</main>; }
