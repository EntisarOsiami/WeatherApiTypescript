"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const weather_routes_1 = __importDefault(require("./routes/weather.routes"));
const history_routes_1 = __importDefault(require("./routes/history.routes"));
(0, dotenv_1.config)();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 40,
    message: {
        success: false,
        error: {
            message: 'try again later, too many requests'
        }
    }
});
app.use(limiter);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, database_1.databaseConnection)().catch(console.error);
app.use('/auth', auth_routes_1.default);
app.use('/weather', weather_routes_1.default);
app.use('/history', history_routes_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: { message: 'weather api' }
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `not found `
        }
    });
});
app.listen(port, () => {
    console.log(`weather API server is running at http://localhost:${port}`);
});
