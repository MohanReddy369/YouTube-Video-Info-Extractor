import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the public folder
app.use(express.static("public"));

// API route for video info
app.get("/api/video-info", async (req, res) => {
    const videoId = req.query.videoId;
    const API_KEY = process.env.YT_API_KEY;

    if (!videoId) {
        return res.json({ error: "No video ID provided" });
    }

    try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return res.json({ error: "No video found!" });
        }

        const video = data.items[0];

        return res.json(video);
    } catch (error) {
        console.error(error);
        return res.json({ error: "Server error fetching video info" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
