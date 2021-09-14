import { useState } from "react"
import ApplicationHome from './component/application';
function App() {
  const [currentPage, setCurrentPage] = useState("top")

  let page;
  if (currentPage === "top") {
    page = <div className="all-wrapper">
      <h1>ようこそテストアプリへ</h1>
      <button onClick={() => { setCurrentPage("explanation") }}>次に進む</button>
    </div>
  } else if (currentPage === "explanation") {
    page = <div className="all-wrapper">
      <h1>説明</h1>
      <h2>このアプリはこうこうこういうアプリです</h2>
      <button onClick={() => { setCurrentPage("app") }}>さっそく始める</button>
    </div>
  } else {
    page = <ApplicationHome />
  }

  return (
    <div className="App">
      {page}
    </div>
  );
}

export default App;
