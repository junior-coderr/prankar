import React, { useState } from "react";
import { useRouter } from "next/navigation";

async function manualLogin(router) {
  const response = await fetch("/api/custom-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "pratikmishra1833@gmail.com",
      name: "Test User",
      image:
        "https://img.freepik.com/premium-vector/programming-home_118813-4357.jpg?semt=ais_hybrid", // Optional
    }),
  });

  if (response.ok) {
    console.log("Session created manually");
    const t = await response.json();
    console.log(t);

    router.push("/home");
    window.location.reload();
  } else {
    const error = await response.json();
    console.error("Failed to create session:", error);
  }
}

export default function CustomLoginBtn() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setShowPopup(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === "122333") {
      setShowPopup(false);
      await manualLogin(router);
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <>
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
      >
        Custom Login
      </button>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              width: "300px",
              animation: "slideIn 0.3s",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <h3
                style={{
                  margin: "0 0 20px 0",
                  color: "#333",
                  textAlign: "center",
                  fontSize: "24px",
                }}
              >
                Enter Password
              </h3>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  padding: "12px",
                  border: "2px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#0056b3")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#007bff")
                  }
                >
                  Submit
                </button>

                <button
                  onClick={() => setShowPopup(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#c82333")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#dc3545")
                  }
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
