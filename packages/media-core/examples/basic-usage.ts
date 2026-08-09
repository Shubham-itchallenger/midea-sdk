import { createMediaClient } from "../src";

const client = createMediaClient({
  apiKey: "YOUR_PEXELS_API_KEY",
});

const unsubscribe = client.onView((event) => {
  console.log("App received:", event);
});

client.trackView("123");

// Later, when you no longer want to receive events:
unsubscribe();