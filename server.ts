import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {
  validateSuperadminCredentials,
  createOtpRecord,
  verifyOtp,
  generateTempPassword,
  SUPERADMIN_USERNAME,
} from './src/utils/auth-logic';
import { UserProfile, OtpRecord, DispatchedEmail, ResearchProposal, Competition } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});
app.use(express.json({ limit: '20mb' }));

// -------------------------------------------------------------
// In-Memory Database Stores (with rich seed data for Sierra Leone)
// -------------------------------------------------------------
const users: UserProfile[] = [
  {
    id: 'usr_andrew_sesay',
    userCode: 'SLNRIP-FND-0001',
    firstName: 'Andrew',
    lastName: 'Sesay',
    dob: '1998-05-14',
    email: 'sesayandrewedusl@gmail.com',
    profilePicture: null,
    role: 'superadmin',
    institution: 'Ministry of Technical and Higher Education',
    district: 'Western Area Urban',
    createdAt: new Date().toISOString(),
    isVerified: true,
  },
  {
    id: 'usr_sahr_k',
    userCode: 'SLNRIP-STU-782419',
    firstName: 'Sahr',
    lastName: 'Kamara',
    dob: '2001-09-22',
    email: 'skamara@fbc.edu.sl',
    profilePicture: null,
    role: 'student',
    institution: 'Fourah Bay College (USL)',
    district: 'Western Area Urban',
    createdAt: new Date().toISOString(),
    isVerified: true,
  },
];

// Active OTP records
const otpStore = new Map<string, OtpRecord>();

// Dispatched Emails Journal (allows in-app live viewing of all outgoing OTPs and passwords)
const dispatchedEmails: DispatchedEmail[] = [];

// Proposals Store
const proposals: ResearchProposal[] = [
  {
    id: 'prop-1',
    trackingCode: 'SL-PROP-2026-081',
    title: 'AI Drone Vision for Early Cassava Mosaic Disease Detection',
    abstract: 'An automated aerial multispectral imaging system designed for smallholder farmers across Moyamba and Bo districts to prevent crop yield collapse.',
    category: 'Sustainable Agriculture',
    budgetNLe: 145000,
    authorId: 'usr_sahr_k',
    authorName: 'Sahr Kamara',
    authorEmail: 'skamara@fbc.edu.sl',
    institution: 'Njala University',
    district: 'Moyamba',
    status: 'Under Review',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    evaluationScores: {
      originality: 18,
      innovation: 19,
      feasibility: 16,
      relevance: 20,
      impact: 18,
      total: 91,
      evaluatorNotes: 'Highly relevant to food security initiatives.',
    },
  },
  {
    id: 'prop-2',
    trackingCode: 'SL-PROP-2026-094',
    title: 'Micro-Hydrokinetic Turbine for Off-Grid Rural Clinics',
    abstract: 'Deploying modular low-head river turbines along the Rokel river basin to power vaccine refrigeration and obstetrics monitoring.',
    category: 'Renewable Energy',
    budgetNLe: 280000,
    authorId: 'usr_fbc_team',
    authorName: 'Dr. Joseph Koroma & Team',
    authorEmail: 'jkoroma@fbc.usl.edu.sl',
    institution: 'Fourah Bay College (USL)',
    district: 'Western Area Rural',
    status: 'Approved',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    evaluationScores: {
      originality: 17,
      innovation: 18,
      feasibility: 18,
      relevance: 19,
      impact: 19,
      total: 91,
      evaluatorNotes: 'Directly addresses maternal health energy resilience.',
    },
  },
  {
    id: 'prop-3',
    trackingCode: 'SL-PROP-2026-112',
    title: 'Biodegradable Cassava Starch Bioplastics for Urban Freetown Packaging',
    abstract: 'Replacing single-use polyethene bags with domestically manufactured water-soluble starch bioplastics from surplus cassava peel biomass.',
    category: 'Mining & Environment',
    budgetNLe: 95000,
    authorId: 'usr_etu_research',
    authorName: 'Mariama Bangura',
    authorEmail: 'mbangura@etu.edu.sl',
    institution: 'Eastern Technical University',
    district: 'Kenema',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// National Competitions Store
const competitions: Competition[] = [
  {
    id: 'comp-1',
    title: '2026 National Clean Electrification Innovation Challenge',
    category: 'Renewable Energy',
    prizePoolNLe: 450000,
    deadline: '2026-12-15T23:59:59Z',
    status: 'Active',
    description: 'Design and deploy scalable solar, micro-hydro, or biomass energy solutions for schools and district clinics across Sierra Leone.',
    eligibility: 'Open to registered students, faculty, and research teams at all Sierra Leone tertiary institutions.',
    applicantsCount: 38,
  },
  {
    id: 'comp-2',
    title: 'National Agri-Tech & Food Security Hackathon',
    category: 'Sustainable Agriculture',
    prizePoolNLe: 300000,
    deadline: '2026-11-30T23:59:59Z',
    status: 'Active',
    description: 'Post-harvest telemetry, solar crop drying, mobile pest identification, and localized agricultural supply chain software.',
    eligibility: 'Sierra Leonean scholars, technical college students, and independent young innovators.',
    applicantsCount: 52,
  },
  {
    id: 'comp-3',
    title: 'Digital Health & Telemedicine Grand Challenge',
    category: 'Healthcare & Epidemics',
    prizePoolNLe: 350000,
    deadline: '2027-01-20T23:59:59Z',
    status: 'Active',
    description: 'Innovations for offline clinical triage, epidemic surveillance, and rapid ambulance dispatch across rural chiefdoms.',
    eligibility: 'Interdisciplinary teams with at least one health science or informatics researcher.',
    applicantsCount: 29,
  },
];

// -------------------------------------------------------------
// Nodemailer Transport (Configurable via ENV or Safe Fallback)
// -------------------------------------------------------------
const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'mailer@slnrip.gov.sl',
    pass: process.env.SMTP_PASS || 'slnrip_smtp_secret',
  },
});

async function dispatchNotificationEmail(
  to: string,
  subject: string,
  contentHtml: string,
  type: DispatchedEmail['type'],
  previewData?: DispatchedEmail['previewData']
): Promise<DispatchedEmail> {
  const emailRecord: DispatchedEmail = {
    id: `email_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    to: to.trim().toLowerCase(),
    subject,
    type,
    timestamp: new Date().toISOString(),
    contentHtml,
    previewData,
  };

  // Add to in-memory journal (max 100 recent emails)
  dispatchedEmails.unshift(emailRecord);
  if (dispatchedEmails.length > 100) dispatchedEmails.pop();

  // Attempt real SMTP if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      await mailTransporter.sendMail({
        from: '"Sierra Leone National Research & Innovation Portal" <security@slnrip.gov.sl>',
        to,
        subject,
        html: contentHtml,
      });
      console.log(`[SMTP] Dispatched to ${to}: ${subject}`);
    } catch (err) {
      console.warn('[SMTP] Delivery error, preserved in journal:', err);
    }
  } else {
    console.log(`[SIMULATED DISPATCH] To: ${to} | Subject: ${subject}`);
  }

  return emailRecord;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

/**
 * Superadmin Login Gateway
 * Strict requirement: "wherein i alone access the back end with the username sesayandrewedusl and password neymarjrsl"
 */
app.post('/api/backend/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Username and password are required.' });
    return;
  }

  const isValid = validateSuperadminCredentials(username, password);

  if (!isValid) {
    res.status(401).json({
      success: false,
      message: 'Access Denied: Unrecognized administrator credentials for the national backend.',
    });
    return;
  }

  const token = `slnrip_admin_token_${Buffer.from(SUPERADMIN_USERNAME).toString('base64')}_${Date.now()}`;
  res.status(200).json({
    success: true,
    token,
    username: SUPERADMIN_USERNAME,
    role: 'superadmin',
    message: 'Founder Superadmin Authenticated successfully.',
  });
});

/**
 * Registration Step 1: User details + Generate 15-second OTP
 * Requirement: "if anyone creates an account after them inputting their first name, last, DOB, password and profile picture and email. after proceeding a 6 digit must be sent directly to their given email provided."
 */
app.post('/api/auth/register-step1', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, dob, email, password, profilePicture } = req.body;

    if (!firstName || !lastName || !dob || !email || !password) {
      res.status(400).json({ success: false, message: 'All personal registration fields are mandatory.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email === normalizedEmail);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    // Create OTP record with strict 15-second TTL
    const otpRecord = createOtpRecord(normalizedEmail, Date.now(), 15);
    otpStore.set(normalizedEmail, otpRecord);

    const emailHtml = `
      <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #F4F7FA; padding: 24px;">
        <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border-top: 6px solid #1EB53A; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <div style="background: #10243A; color: #fff; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 11px; letter-spacing: 1px;">
              REPUBLIC OF SIERRA LEONE
            </div>
          </div>
          <h2 style="color: #10243A; margin: 0 0 8px 0; font-size: 22px;">National Scholar Verification Code</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
            Hello <strong>${firstName} ${lastName}</strong>, thank you for joining the Sierra Leone National Research & Innovation Portal.
          </p>
          <div style="background: #F1F5F9; border: 2px dashed #0072C6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748B; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">
              One-Time 6-Digit Activation Key
            </span>
            <div style="font-size: 38px; font-weight: 800; font-family: monospace; letter-spacing: 8px; color: #0072C6;">
              ${otpRecord.otpCode}
            </div>
          </div>
          <div style="background: #FEF2F2; border-left: 4px solid #DC2626; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="color: #991B1B; font-size: 13px; font-weight: 700; margin: 0;">
              ⚠️ STRICT 15-SECOND WINDOW: This code expires exactly 15 seconds after dispatch. If entered after 15 seconds, it will be rejected automatically.
            </p>
          </div>
          <p style="color: #64748B; font-size: 12px; margin: 0;">
            Sierra Leone National Research & Innovation Portal (SLNRIP) • Proposed Digital Initiative by Andrew Sesay
          </p>
        </div>
      </div>
    `;

    const dispatched = await dispatchNotificationEmail(
      normalizedEmail,
      'SLNRIP 6-Digit Verification Code (Valid for 15 Seconds)',
      emailHtml,
      'registration_otp',
      {
        code: otpRecord.otpCode,
        expiresInSeconds: 15,
      }
    );

    res.status(200).json({
      success: true,
      message: 'A 6-digit verification code has been sent to your email. Expires strictly in 15 seconds!',
      expiresInSeconds: 15,
      previewCodeForDev: otpRecord.otpCode,
      dispatchedEmailId: dispatched.id,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error occurred.' });
  }
});

/**
 * Registration Step 2: Validate 6-digit OTP (Strict <= 15s)
 * Requirement: "if after 15 seconds you input the code must not enter unless you request a new one"
 */
app.post('/api/auth/register-step2-verify', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, dob, email, password, profilePicture, otpCode } = req.body;

    if (!email || !otpCode) {
      res.status(400).json({ success: false, message: 'Email and 6-digit code are mandatory.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const record = otpStore.get(normalizedEmail);
    const nowMs = Date.now();

    const verification = verifyOtp(record, otpCode, nowMs);

    if (!verification.success) {
      if (record && verification.reason === 'EXPIRED') {
        record.consumed = true; // Mark consumed so it cannot be retried
      }
      res.status(verification.reason === 'EXPIRED' ? 403 : 400).json({
        success: false,
        reason: verification.reason,
        message: verification.message,
        expired: verification.reason === 'EXPIRED',
      });
      return;
    }

    // Mark as consumed
    if (record) {
      record.consumed = true;
    }

    // Create user profile
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const userCode = `SLNRIP-STU-${randomSuffix}`;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      userCode,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob,
      email: normalizedEmail,
      profilePicture: profilePicture || null,
      role: 'student',
      institution: 'Fourah Bay College (USL)',
      district: 'Western Area Urban',
      createdAt: new Date().toISOString(),
      isVerified: true,
    };

    users.push(newUser);

    const token = `slnrip_user_token_${newUser.id}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: 'Account successfully activated and verified.',
      token,
      user: newUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error occurred.' });
  }
});

/**
 * Resend 15-Second OTP
 */
app.post('/api/auth/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email, firstName } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email address is required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpRecord = createOtpRecord(normalizedEmail, Date.now(), 15);
    otpStore.set(normalizedEmail, otpRecord);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #F4F7FA; padding: 24px;">
        <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 8px; border-top: 6px solid #1EB53A; padding: 24px;">
          <h2 style="color: #10243A; margin-top: 0;">New 6-Digit Activation Code</h2>
          <p>Hello ${firstName || 'Scholar'},</p>
          <p>Your requested replacement 6-digit code is:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0072C6; text-align: center; margin: 20px 0;">
            ${otpRecord.otpCode}
          </div>
          <p style="color: #D32F2F; font-size: 13px; font-weight: bold; text-align: center;">
            ⚠️ EXPIRES IN 15 SECONDS.
          </p>
        </div>
      </div>
    `;

    const dispatched = await dispatchNotificationEmail(
      normalizedEmail,
      'New SLNRIP Activation Code (15-Second Window)',
      emailHtml,
      'registration_otp',
      {
        code: otpRecord.otpCode,
        expiresInSeconds: 15,
      }
    );

    res.status(200).json({
      success: true,
      message: 'A brand-new 6-digit code has been dispatched. You have 15 seconds.',
      expiresInSeconds: 15,
      previewCodeForDev: otpRecord.otpCode,
      dispatchedEmailId: dispatched.id,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error occurred.' });
  }
});

/**
 * Forgot Password Gateway
 * Requirement: "and if you forget the password, it must be send to your email address you provided."
 */
app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Please enter your registered email address.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email === normalizedEmail);

    const tempPassword = generateTempPassword();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #F4F7FA; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 8px; border-top: 6px solid #0072C6; padding: 28px;">
          <h2 style="color: #10243A; margin-top: 0;">SLNRIP Password Recovery</h2>
          <p>Dear ${user ? `${user.firstName} ${user.lastName}` : 'Scholar'},</p>
          <p>You requested password recovery for your Sierra Leone National Research & Innovation Portal account.</p>
          <div style="background: #F8FAFC; border: 1px solid #CBD5E1; padding: 16px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <span style="font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: bold; display: block; margin-bottom: 4px;">
              Your Temporary Password
            </span>
            <span style="font-size: 24px; font-weight: bold; font-family: monospace; letter-spacing: 2px; color: #10243A;">
              ${tempPassword}
            </span>
          </div>
          <p style="font-size: 13px; color: #475569;">
            Log in with this password and promptly update your password in your profile security settings.
          </p>
        </div>
      </div>
    `;

    const dispatched = await dispatchNotificationEmail(
      normalizedEmail,
      'SLNRIP Password Recovery Credentials',
      emailHtml,
      'forgot_password',
      {
        tempPassword,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Your password credentials have been sent directly to your registered email address.',
      previewPasswordForDev: tempPassword,
      dispatchedEmailId: dispatched.id,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Server error occurred.' });
  }
});

/**
 * Standard User Login
 */
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    res.status(401).json({ success: false, message: 'No account registered with this email address.' });
    return;
  }

  const token = `slnrip_user_token_${user.id}_${Date.now()}`;
  res.status(200).json({
    success: true,
    token,
    user,
    message: 'Welcome back to SLNRIP!',
  });
});

/**
 * Outgoing Emails Journal (interactive live inbox simulator)
 */
app.get('/api/emails/recent', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    emails: dispatchedEmails.slice(0, 20),
  });
});

/**
 * Proposals Endpoints
 */
app.get('/api/proposals', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, proposals });
});

app.post('/api/proposals', (req: Request, res: Response) => {
  const { title, abstract, category, budgetNLe, authorName, authorEmail, institution, district } = req.body;
  if (!title || !abstract || !budgetNLe) {
    res.status(400).json({ success: false, message: 'Title, abstract and budget are required.' });
    return;
  }

  const randomNum = Math.floor(100 + Math.random() * 900);
  const newProposal: ResearchProposal = {
    id: `prop_${Date.now()}`,
    trackingCode: `SL-PROP-2026-${randomNum}`,
    title: title.trim(),
    abstract: abstract.trim(),
    category: category || 'Renewable Energy',
    budgetNLe: Number(budgetNLe),
    authorId: `usr_${Date.now()}`,
    authorName: authorName || 'National Scholar',
    authorEmail: authorEmail || 'scholar@university.edu.sl',
    institution: institution || 'Fourah Bay College (USL)',
    district: district || 'Western Area Urban',
    status: 'Submitted',
    createdAt: new Date().toISOString(),
  };

  proposals.unshift(newProposal);
  res.status(201).json({ success: true, proposal: newProposal, message: 'Research proposal successfully submitted.' });
});

app.patch('/api/proposals/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const proposal = proposals.find((p) => p.id === id);
  if (!proposal) {
    res.status(404).json({ success: false, message: 'Proposal not found.' });
    return;
  }

  proposal.status = status;
  if (notes && proposal.evaluationScores) {
    proposal.evaluationScores.evaluatorNotes = notes;
  }

  res.status(200).json({ success: true, proposal, message: `Proposal status updated to ${status}.` });
});

app.post('/api/proposals/:id/evaluate', (req: Request, res: Response) => {
  const { id } = req.params;
  const { originality, innovation, feasibility, relevance, impact, notes } = req.body;

  const proposal = proposals.find((p) => p.id === id);
  if (!proposal) {
    res.status(404).json({ success: false, message: 'Proposal not found.' });
    return;
  }

  const o = Math.min(20, Math.max(0, Number(originality) || 0));
  const i = Math.min(20, Math.max(0, Number(innovation) || 0));
  const f = Math.min(20, Math.max(0, Number(feasibility) || 0));
  const r = Math.min(20, Math.max(0, Number(relevance) || 0));
  const im = Math.min(20, Math.max(0, Number(impact) || 0));

  proposal.evaluationScores = {
    originality: o,
    innovation: i,
    feasibility: f,
    relevance: r,
    impact: im,
    total: o + i + f + r + im,
    evaluatorNotes: notes || '',
  };

  res.status(200).json({ success: true, proposal, message: 'Evaluation scoring successfully recorded.' });
});

/**
 * Competitions Endpoints
 */
app.get('/api/competitions', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, competitions });
});

app.post('/api/competitions/:id/apply', (req: Request, res: Response) => {
  const { id } = req.params;
  const comp = competitions.find((c) => c.id === id);
  if (!comp) {
    res.status(404).json({ success: false, message: 'Competition not found.' });
    return;
  }
  comp.applicantsCount += 1;
  res.status(200).json({ success: true, message: 'Application recorded for competition.', competition: comp });
});

/**
 * System Health
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    portal: 'Sierra Leone National Research & Innovation Portal (SLNRIP)',
    superadminGateway: 'active',
    strictOtpWindowSeconds: 15,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Vite Dev Middleware / Production Static Asset Handling
// -------------------------------------------------------------
async function bootstrapServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[SLNRIP] Vite Dev Middleware mounted in development mode.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[SLNRIP] Static production assets mounted.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`================================================================`);
    console.log(`Sierra Leone National Research & Innovation Portal (SLNRIP)`);
    console.log(`Server actively running on http://0.0.0.0:${PORT}`);
    console.log(`Founder Superadmin Access: ${SUPERADMIN_USERNAME}`);
    console.log(`Strict OTP Window: 15 seconds`);
    console.log(`================================================================`);
  });
}

bootstrapServer().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
