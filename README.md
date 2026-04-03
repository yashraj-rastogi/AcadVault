# AcadVault

**Your Academic Achievements, Beautifully Organized**

AcadVault is a premium academic achievement tracking, verification, and portfolio generation platform designed for students, faculty, and administrators. It provides a system to track academic milestones and elevate student scholarly identity via a secure platform.

![AcadVault](https://lh3.googleusercontent.com/pw/AJFCJaVpU_yU1_sPZ6gJ-8xQvqA9JzKjMlzUoKz1rL7D1YxgE5jK1z_Ew7xW=w2400) <!-- Optional placeholder for an image/banner -->

## 🌟 Key Features

1. **Academic Achievement Tracking**: Submit and manage academic achievements with a streamlined, intuitive interface. Students can update their CGPA, hackathon wins, research papers, and workshop participations.
2. **Faculty Verification**: Faculty members can verify student achievements directly via secure credentials.
3. **Portfolio Generation**: Automatically create professional learning portfolios and export high-fidelity digital resumes for verified milestones.
4. **Three Tier Portals**:
   - **Student Portal**: Manage achievements, build portfolios, and track your academic journey.
   - **Faculty Portal**: Verify student achievements, manage mentees' profiles, and provide data-driven mentorship.
   - **Admin Portal**: Manage system users, generate institutional reports (NAAC/NIRF), and oversee overall operations.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React, App Router/Pages)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: SQLite (Development) / Supported Providers via Prisma (PostgreSQL, MySQL, etc.)

## p Project Structure

```text
AcadVault/
├── app/               # Next.js Application Routes (Student, Faculty, Admin, Auth)
├── components/        # Reusable React components (shadcn/ui, custom UI)
├── prisma/            # Prisma schema models and Database seeding scripts
├── lib/               # Utility functions and library wrappers
├── hooks/             # Custom React Hooks
├── public/            # Static assets (images, icons)
├── styles/            # Global styles (Tailwind config, global.css)
└── package.json       # Project dependencies and operational scripts
```

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd SIH-25/AcadVault
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   Copy `.env.example` to `.env` (or configure `.env` directly) and set your `DATABASE_URL`.
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Seed the database** (Optional but recommended):
   ```bash
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment on Vercel

This repository is optimized and ready for immediate deployment on Vercel.

1. Publish your code to a Git provider (GitHub, GitLab, or Bitbucket).
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
3. Import your repository.
4. **Important**:
   - **Root Directory**: Since the Next.js app sits inside the `AcadVault` folder, make sure to configure the **Root Directory** setting to `AcadVault` during the Vercel project setup.
   - **Framework Preset**: Vercel should automatically detect `Next.js`.
   - **Environment Variables**: Add `DATABASE_URL` and any other secrets from your `.env` file to your Vercel project environment variables.
5. Click **Deploy**. Vercel will automatically run the deployment. 

*(Note: The build process automatically executes Prisma Client generation via the pre-configured `postinstall` script in `package.json`).*

---
© 2024 AcadVault. All rights reserved.
