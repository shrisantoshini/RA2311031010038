const email = "ss0821@srmist.edu.in";
const name = "Shri Santoshini B";
const rollNo = "RA2311031010038";

// FILL THESE IN:
const mobileNo = "7397330077";
const githubUsername = "shrisantoshini";
const accessCode = "QkbpxH";

async function register() {
  try {
    const res = await fetch("http://20.207.122.201/evaluation-service/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        rollNo,
        mobileNo,
        githubUsername,
        accessCode
      })
    });

    const data = await res.json();
    console.log("=== REGISTRATION SUCCESSFUL ===");
    console.log("Client ID:", data.clientID);
    console.log("Client Secret:", data.clientSecret);
    console.log("===============================");
  } catch (err) {
    console.error("Failed to register:", err.message);
  }
}

register();
