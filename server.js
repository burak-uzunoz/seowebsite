const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Data file paths
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');
const NEWSLETTER_FILE = path.join(__dirname, 'data', 'newsletter.json');
const QUOTES_FILE = path.join(__dirname, 'data', 'quotes.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
[CONTACTS_FILE, NEWSLETTER_FILE, QUOTES_FILE].forEach(f => {
    if (!fs.existsSync(f)) fs.writeFileSync(f, '[]', 'utf-8');
});

// Helper: read/write JSON
function readJSON(file) {
    try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
    catch { return []; }
}
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

// ==================== API ROUTES ====================

// Contact form
app.post('/api/contact', (req, res) => {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'İsim, e-posta ve mesaj zorunludur.' });
    }
    const contacts = readJSON(CONTACTS_FILE);
    const contact = {
        id: Date.now(),
        name, email, phone: phone || '', service: service || '', message,
        date: new Date().toISOString(),
        status: 'new'
    };
    contacts.push(contact);
    writeJSON(CONTACTS_FILE, contacts);
    res.json({ success: true, message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.' });
});

// Newsletter subscription
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'E-posta zorunludur.' });
    const subscribers = readJSON(NEWSLETTER_FILE);
    if (subscribers.find(s => s.email === email)) {
        return res.status(400).json({ success: false, error: 'Bu e-posta zaten abone.' });
    }
    subscribers.push({ id: Date.now(), email, date: new Date().toISOString() });
    writeJSON(NEWSLETTER_FILE, subscribers);
    res.json({ success: true, message: 'Bültene başarıyla abone oldunuz!' });
});

// Quote request
app.post('/api/quote', (req, res) => {
    const { name, email, company, service, budget, details } = req.body;
    if (!name || !email || !service) {
        return res.status(400).json({ success: false, error: 'İsim, e-posta ve hizmet seçimi zorunludur.' });
    }
    const quotes = readJSON(QUOTES_FILE);
    quotes.push({
        id: Date.now(), name, email, company: company || '',
        service, budget: budget || '', details: details || '',
        date: new Date().toISOString(), status: 'pending'
    });
    writeJSON(QUOTES_FILE, quotes);
    res.json({ success: true, message: 'Teklif talebiniz alındı! 24 saat içinde size ulaşacağız.' });
});

// Get contacts (admin)
app.get('/api/admin/contacts', (req, res) => {
    res.json(readJSON(CONTACTS_FILE));
});

// Get subscribers (admin)
app.get('/api/admin/subscribers', (req, res) => {
    res.json(readJSON(NEWSLETTER_FILE));
});

// Get quotes (admin)
app.get('/api/admin/quotes', (req, res) => {
    res.json(readJSON(QUOTES_FILE));
});

// Stats
app.get('/api/stats', (req, res) => {
    const contacts = readJSON(CONTACTS_FILE);
    const subscribers = readJSON(NEWSLETTER_FILE);
    const quotes = readJSON(QUOTES_FILE);
    res.json({
        totalContacts: contacts.length,
        totalSubscribers: subscribers.length,
        totalQuotes: quotes.length,
        newContacts: contacts.filter(c => c.status === 'new').length,
        pendingQuotes: quotes.filter(q => q.status === 'pending').length
    });
});

// SPA fallback
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════════╗`);
    console.log(`  ║   🎮 Pixel SEO - Test Sunucusu Çalıştı  ║`);
    console.log(`  ╠══════════════════════════════════════════╣`);
    console.log(`  ║                                          ║`);
    console.log(`  ║   🌐 http://localhost:${PORT}              ║`);
    console.log(`  ║   📊 Admin: http://localhost:${PORT}/admin ║`);
    console.log(`  ║                                          ║`);
    console.log(`  ╚══════════════════════════════════════════╝\n`);
});
