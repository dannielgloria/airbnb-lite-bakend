require("dotenv").config();

const { connectDb } = require("./config/db");
const { initCloudinary } = require("./config/cloudinary");
const { createApp } = require("./app");

async function boostrap() {
    await connectDb();
    initCloudinary();

    const app = createApp();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} 🚀`);
    });
}

boostrap().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});