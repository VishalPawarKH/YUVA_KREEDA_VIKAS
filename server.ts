import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-yuva-kreeda-vikas';

// Email Transporter Setup (using Ethereal for testing)
let transporter: nodemailer.Transporter;
nodemailer.createTestAccount().then((account) => {
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
  console.log('Test email account created. Emails will be logged to console.');
}).catch(console.error);

// In-memory Database
let users: any[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'vishalsandippawar@gmail.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  }
];

const sports = [
  { id: '1', name: 'Cricket', icon: 'cricket' },
  { id: '2', name: 'Football', icon: 'football' },
  { id: '3', name: 'Badminton', icon: 'badminton' },
  { id: '4', name: 'Swimming', icon: 'swimming' },
  { id: '5', name: 'Tennis', icon: 'tennis' },
  { id: '6', name: 'Hockey', icon: 'hockey' },
  { id: '7', name: 'Athletics', icon: 'athletics' }
];

let slots: any[] = [
  { id: '1', sportId: '1', date: '2026-03-20', startTime: '09:00', endTime: '11:00', capacity: 22, bookedCount: 0 },
  { id: '2', sportId: '2', date: '2026-03-20', startTime: '16:00', endTime: '18:00', capacity: 22, bookedCount: 0 },
  { id: '3', sportId: '3', date: '2026-03-21', startTime: '10:00', endTime: '11:00', capacity: 4, bookedCount: 0 },
  { id: '4', sportId: '4', date: '2026-03-21', startTime: '07:00', endTime: '08:00', capacity: 10, bookedCount: 0 },
  { id: '5', sportId: '5', date: '2026-03-22', startTime: '17:00', endTime: '19:00', capacity: 4, bookedCount: 0 },
];

let bookings: any[] = [];

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Auth
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: String(Date.now()), name, email, password: hashedPassword, role: 'user' };
    users.push(newUser);
    
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  // Sports
  app.get('/api/sports', (req, res) => {
    res.json(sports);
  });

  // Slots
  app.get('/api/slots', (req, res) => {
    const { sportId } = req.query;
    let filteredSlots = slots;
    if (sportId) {
      filteredSlots = slots.filter(s => s.sportId === sportId);
    }
    res.json(filteredSlots);
  });

  // Bookings
  app.get('/api/bookings', authenticateToken, (req: any, res) => {
    const userBookings = bookings.filter(b => b.userId === req.user.id);
    const enrichedBookings = userBookings.map(b => {
      const slot = slots.find(s => s.id === b.slotId);
      const sport = sports.find(sp => sp.id === slot?.sportId);
      return { ...b, slot, sport };
    });
    res.json(enrichedBookings);
  });

  app.post('/api/bookings', authenticateToken, async (req: any, res) => {
    const { slotId } = req.body;
    const slot = slots.find(s => s.id === slotId);
    
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    if (slot.bookedCount >= slot.capacity) return res.status(400).json({ error: 'Slot is full' });
    
    const existingBooking = bookings.find(b => b.userId === req.user.id && b.slotId === slotId && b.status === 'booked');
    if (existingBooking) return res.status(400).json({ error: 'Already booked this slot' });

    slot.bookedCount += 1;
    const newBooking = { id: String(Date.now()), userId: req.user.id, slotId, status: 'booked', createdAt: new Date().toISOString() };
    bookings.push(newBooking);
    
    // Send confirmation email asynchronously
    if (transporter) {
      const sport = sports.find(sp => sp.id === slot.sportId);
      const user = users.find(u => u.id === req.user.id);
      
      if (user && sport) {
        try {
          const info = await transporter.sendMail({
            from: '"Yuva Kreeda Vikas" <noreply@yuvakreedavikas.com>',
            to: user.email,
            subject: `Booking Confirmation: ${sport.name}`,
            text: `Hello ${user.name},\n\nYour booking for ${sport.name} has been confirmed!\n\nDetails:\nDate: ${slot.date}\nTime: ${slot.startTime} - ${slot.endTime}\n\nThank you for using Yuva Kreeda Vikas.`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #059669;">Booking Confirmed!</h2>
                <p>Hello <strong>${user.name}</strong>,</p>
                <p>Your booking for <strong>${sport.name}</strong> has been successfully confirmed.</p>
                <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Booking Details:</h3>
                  <p><strong>Date:</strong> ${slot.date}</p>
                  <p><strong>Time:</strong> ${slot.startTime} - ${slot.endTime}</p>
                </div>
                <p>Thank you for using Yuva Kreeda Vikas.</p>
              </div>
            `
          });
          console.log('Confirmation email sent! Preview URL: %s', nodemailer.getTestMessageUrl(info));
        } catch (emailErr) {
          console.error('Failed to send confirmation email:', emailErr);
        }
      }
    }

    res.json(newBooking);
  });

  app.post('/api/bookings/:id/cancel', authenticateToken, (req: any, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    if (booking.status === 'cancelled') return res.status(400).json({ error: 'Already cancelled' });

    booking.status = 'cancelled';
    const slot = slots.find(s => s.id === booking.slotId);
    if (slot) slot.bookedCount = Math.max(0, slot.bookedCount - 1);

    res.json(booking);
  });

  // Admin routes
  app.get('/api/admin/stats', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    
    res.json({
      totalUsers: users.length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter(b => b.status === 'booked').length,
      totalSlots: slots.length
    });
  });

  app.post('/api/admin/slots', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    
    const { sportId, date, startTime, endTime, capacity } = req.body;
    const newSlot = { id: String(Date.now()), sportId, date, startTime, endTime, capacity, bookedCount: 0 };
    slots.push(newSlot);
    res.json(newSlot);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
