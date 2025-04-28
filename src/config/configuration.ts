import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    port: parseInt(process.env.PORT||'3000', 10) || 3000,
    socketPort: parseInt(process.env.SOCKET_PORT||'3001', 10) || 3001,
    fileUploadPath: process.env.FILE_UPLOAD_DEST || './uploads'
}));