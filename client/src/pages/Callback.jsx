import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      window.location.href = "/"; // reload app with token in storage
    } else {
      window.location.href = "/"; // fallback
    }
  }, []);

  return <p>Logging you in...</p>;
}
