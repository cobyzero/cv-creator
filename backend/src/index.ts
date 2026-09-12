import { createApp } from "./app.js";
import { PORT } from "./config/env.js";

createApp().listen(PORT, () => console.log(`backend :${PORT}`));
