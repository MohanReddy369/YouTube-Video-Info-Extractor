document.getElementById("getInfoBtn").addEventListener("click", async function () {
    const url = document.getElementById("videoUrl").value.trim();

    if (!url) {
        alert("Please enter a YouTube URL");
        return;
    }

    function extractVideoId(url) {
        let videoId = null;

        if (url.includes("youtube.com")) {
            try {
                const urlObj = new URL(url);
                videoId = urlObj.searchParams.get("v");
            } catch (e) {
                videoId = null;
            }
        }

        if (!videoId && url.includes("youtu.be")) {
            const parts = url.split("/");
            videoId = parts[parts.length - 1].split("?")[0];
        }

        return videoId;
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
        alert("Invalid YouTube URL");
        return;
    }

    try {
        // Call backend instead of Google API directly
        const response = await fetch(`/api/video-info?videoId=${videoId}`);
        const data = await response.json();

        if (data.error) {
            document.getElementById("result").innerHTML = data.error;
            return;
        }

        const snippet = data.snippet;
        const stats = data.statistics;

        document.getElementById("result").innerHTML = `
            <h3>${snippet.title}</h3>
            <p><b>Channel:</b> ${snippet.channelTitle}</p>
            <p><b>Views:</b> ${stats.viewCount}</p>
            <p><b>Published on:</b> ${new Date(snippet.publishedAt).toLocaleDateString()}</p>
            <p><b>Description:</b> ${snippet.description ? snippet.description.substring(0, 300) + "..." : "No description"}</p>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById("result").innerHTML = "Error fetching video info!";
    }
});
