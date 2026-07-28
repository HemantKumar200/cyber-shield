require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Cyber Shield Server Running on http://localhost:${PORT}`);
});