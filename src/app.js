
import express from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors'; 
const app = express();

const configuredOrigins = [
    process.env.CORS_ORIGIN,
    process.env.Cors_origin,
    process.env.FRONTEND_URL,
]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        const isLocalOrigin =
            !origin ||
            origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:');

        const isConfiguredOrigin = configuredOrigins.includes(origin);

        if (isLocalOrigin || isConfiguredOrigin) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked from origin: ${origin}`));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({
    limit: '10kb'  
}));
app.use(express.urlencoded({ extended: true, 
    limit: '10kb'  
}));
app.use(express.static('public'));
app.use(cookieParser());

//routes
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import healthcheckRoutes from "./routes/healthcheck.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/healthcheck", healthcheckRoutes);
export default app;
