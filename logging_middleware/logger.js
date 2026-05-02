async function Log(stack, level, pkg, message) {
  try {
    const token = localStorage.getItem("auth_token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    await fetch("/evaluation-service/logs", {
      method: "POST",
      headers,
      body: JSON.stringify({
        stack: stack,
        level: level,
        package: pkg,
        message: message,
      }),
    });
  } catch (err) {
    // silently fail - don't want logger to break app
  }
}

export default Log;
