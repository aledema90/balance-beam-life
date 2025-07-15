# Balance Beam Life — 50/30/20 Budget Tracker

## Overview

Balance Beam Life is a personal finance web app that helps you manage your expenses using the 50/30/20 budgeting rule. Track your monthly and yearly spending, add/edit/delete expenses, view budget breakdowns, and adjust your financial settings—all in one place.

---

## Features

- **User Authentication** (sign in/out)
- **Monthly & Yearly Budget Tracking**
- **Expense Management** (add, edit, delete)
- **Budget Overview & Summaries**
- **Settings for Salary, Categories, etc.**
- **Responsive, Modern UI**

---

## How It Works

1. **Authenticate**: Sign in to access your dashboard.
2. **Dashboard**: View summaries, add expenses, and see your budget breakdown.
3. **Data Storage**: All data is securely stored and managed via Supabase.

---

## Project Structure & File Purposes

| File/Folder              | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `App.tsx`, `main.tsx`    | App entry, routing, global providers                      |
| `pages/`                 | Top-level pages (auth, home, 404)                         |
| `components/`            | Main feature components (dashboard, forms, lists, modals) |
| `components/ui/`         | Reusable UI primitives (buttons, cards, dialogs, etc.)    |
| `hooks/`                 | Custom React hooks for business logic                     |
| `integrations/supabase/` | Supabase client and types                                 |
| `lib/utils.ts`           | Utility functions                                         |
| `types/`                 | TypeScript types/interfaces                               |
| `supabase/`              | Backend config and migrations                             |

### Key Components

- **BudgetDashboard.tsx**: Main dashboard, orchestrates all budget features and UI.
- **BudgetOverview.tsx**: Shows a breakdown of the monthly budget and spending.
- **ExpenseForm.tsx**: Form to add new expenses.
- **ExpenseList.tsx**: Displays a list of all expenses.
- **MonthlySummary.tsx**: Shows a summary of the current month’s budget and spending.
- **SettingsModal.tsx**: Modal for adjusting user/budget settings.
- **YearlyForecast.tsx**: Projects spending and budget for the year.

### Hooks

- **useBudget.ts**: All budget logic (fetching, adding, updating, deleting expenses, and managing settings).
- **useAuth.ts**: Authentication logic (sign in/out, user state).

### Integrations

- **integrations/supabase/**: Connects to Supabase for backend/auth/database.

### Types & Utilities

- **types/budget.ts**: TypeScript types/interfaces for budget data.
- **lib/utils.ts**: Helper functions.

---

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

---

## Setup & Development

```sh
# Clone the repository
 git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

---

## Deployment

You can deploy this project using Lovable or your preferred platform. For Lovable, open your project and click Share -> Publish.

---

## Custom Domain

To connect a custom domain, navigate to Project > Settings > Domains and click Connect Domain. See [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide) for more info.
