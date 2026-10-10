import React from "react";
function describeFailure(value) { return String(value); }
export function App() { return <main>{describeFailure(1)}</main>; }
