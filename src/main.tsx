import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// React 애플리케이션을 DOM 루트에 연결하고 개발 중 오류 감지를 위해 StrictMode를 적용합니다.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
