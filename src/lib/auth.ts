import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

// In-memory brute-force tracker: email → { attempts, lockedUntil }
const loginAttempts = new Map<string, { attempts: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function checkLoginAllowed(email: string): { allowed: boolean; minutesLeft?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(email);
  if (!entry) return { allowed: true };
  if (entry.lockedUntil > now) {
    const minutesLeft = Math.ceil((entry.lockedUntil - now) / 60000);
    return { allowed: false, minutesLeft };
  }
  return { allowed: true };
}

function recordFailedLogin(email: string) {
  const now = Date.now();
  const entry = loginAttempts.get(email) ?? { attempts: 0, lockedUntil: 0 };
  entry.attempts += 1;
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCK_DURATION_MS;
    entry.attempts = 0; // reset counter after lock
  }
  loginAttempts.set(email, entry);
}

function clearLoginRecord(email: string) {
  loginAttempts.delete(email);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase();

        // Brute-force check
        const { allowed, minutesLeft } = checkLoginAllowed(email);
        if (!allowed) {
          throw new Error(`LOCKED:${minutesLeft}`);
        }

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin) {
          recordFailedLogin(email);
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, admin.password);
        if (!valid) {
          recordFailedLogin(email);
          return null;
        }

        clearLoginRecord(email);
        return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/admin/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
