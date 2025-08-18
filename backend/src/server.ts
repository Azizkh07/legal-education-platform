import app from './app';
import { config } from './config';
import { pool } from './database';
import { usersRoutes } from './routes/users';

const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    // Check if admin exists (using YOUR columns - is_admin, is_approved)
    const adminCheck = await pool.query(
      'SELECT email, is_admin, is_approved FROM users WHERE is_admin = true'
    );
    
    console.log('👑 Admin users found:', adminCheck.rows.length);
    if (adminCheck.rows.length > 0) {
      console.log('👑 Admin details:', adminCheck.rows.map(u => ({
        email: u.email,
        is_admin: u.is_admin,
        is_approved: u.is_approved
      })));
    }
    app.use('/api/users', usersRoutes);
    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📡 API URL: ${config.apiUrl}`);
      console.log(`📁 Uploads path: ${config.storage.uploadsPath}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();