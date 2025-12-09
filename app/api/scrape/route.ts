import { google } from "googleapis";
import { NextResponse } from "next/server";
import { extractVideoID } from "@/lib/utils";

export async function POST(req: Request) {
    try {
        const { youtubeUrl, limit, apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json(
                { error: "API Key is missing. Please check your settings." },
                { status: 401 }
            );
        }

        if (!youtubeUrl) {
            return NextResponse.json(
                { error: "YouTube URL is required." },
                { status: 400 }
            );
        }

        const videoId = extractVideoID(youtubeUrl);
        if (!videoId) {
            return NextResponse.json(
                { error: "Invalid YouTube URL. Could not extract Video ID." },
                { status: 400 }
            );
        }

        const maxComments = Math.min(Math.max(Number(limit) || 10, 10), 2000); // Clamp between 10 and 2000

        const youtube = google.youtube({
            version: "v3",
            auth: apiKey,
        });

        let allComments: any[] = [];
        let nextPageToken: string | undefined = undefined;
        let totalRetrieved = 0;

        // First, fetch video details to get title/channel
        const videoResponse = await youtube.videos.list({
            part: ["snippet", "statistics"],
            id: [videoId],
        });

        const videoDetails = videoResponse.data.items?.[0];
        if (!videoDetails) {
            return NextResponse.json(
                { error: "Video not found or API Key is invalid." },
                { status: 404 }
            );
        }

        const videoMeta = {
            title: videoDetails.snippet?.title,
            channel: videoDetails.snippet?.channelTitle,
            thumbnail: videoDetails.snippet?.thumbnails?.high?.url,
            total_comments: videoDetails.statistics?.commentCount,
        };

        // Loop for comments
        while (totalRetrieved < maxComments) {
            const remaining = maxComments - totalRetrieved;
            // API max result per page is 100
            const maxResults = Math.min(remaining, 100);

            try {
                const response: any = await youtube.commentThreads.list({
                    part: ["snippet"],
                    videoId: videoId,
                    maxResults: maxResults,
                    pageToken: nextPageToken,
                    textFormat: "plainText",
                    order: "relevance",
                });

                const items = response.data.items || [];

                for (const item of items) {
                    const snippet = item.snippet?.topLevelComment?.snippet;
                    if (snippet) {
                        allComments.push({
                            author_name: snippet.authorDisplayName,
                            text_display: snippet.textDisplay,
                            like_count: snippet.likeCount,
                            published_at: snippet.publishedAt,
                            is_reply: false, // For simplicity in this v1, we focus on top-level threads
                        });
                    }
                }

                totalRetrieved += items.length;
                nextPageToken = response.data.nextPageToken || undefined;

                if (!nextPageToken || items.length === 0) {
                    break;
                }
            } catch (err: any) {
                console.error("YouTube API Error:", err);
                // If it's a quota or auth error, stop and return what we have or error
                if (err.code === 403 || err.code === 400) {
                    throw err; // Propagate to outer catch
                }
                break;
            }
        }

        return NextResponse.json({
            meta: videoMeta,
            comments: allComments,
        });

    } catch (error: any) {
        console.error("Scrape Error:", error);

        let status = 500;
        let message = "Internal Server Error";

        // Handle Google API Errors
        if (error.code === 400 || error.code === 403) {
            // Check for specific reasons if available in the error object structure
            // googleapis often returns errors with a structure like error.errors[0].reason
            const reason = error.errors?.[0]?.reason;

            if (reason === 'keyInvalid' || error.message?.includes('API key not valid')) {
                status = 401;
                message = "Invalid API Key, please check settings.";
            } else if (reason === 'quotaExceeded') {
                status = 429;
                message = "YouTube API Quota Exceeded. Please try again later or use a different key.";
            } else {
                status = error.code;
                message = error.message || "YouTube API Error";
            }
        } else if (error.code && typeof error.code === 'number') {
            status = error.code;
            message = error.message;
        }

        return NextResponse.json({ error: message }, { status });
    }
}
