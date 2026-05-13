import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/test")
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error("API 호출 실패:", error);
        setMessage("연결 실패");
      });
  }, []);

  return (
    <div>
      <h1>Tangerine</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;