import { useState } from "react";
import HomePage from "./components/HomePage";
import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <Header />

        <HomePage />
      </section>
      <footer></footer>
    </div>
  );
}

export default App;
