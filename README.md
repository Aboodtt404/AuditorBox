# AuditorBox MVP

A bilingual audit engagement management application built on Internet Computer with Rust backend and React TypeScript frontend.

## 🎉 Current Status

- ✅ **Backend**: Fully deployed and running on local IC replica
- ✅ **Frontend**: Built and ready (use dev server)
- ✅ **Security**: All vulnerabilities fixed
- 📦 **Deployment**: 90% complete (see DEPLOYMENT_STATUS.md)

## Quick Start (Development Mode)

```bash
# Terminal 1: Start IC replica
dfx start

# Terminal 2: Run frontend dev server
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser!

## Features

- **Authentication**: Secure Internet Identity integration
- **Role-Based Access**: 6 user roles (Admin, Partner, Manager, Senior, Staff, ClientUser)
- **Organization Management**: Create and manage organizations and entities
- **XBRL Taxonomy Support**: US GAAP, IFRS, and custom taxonomies
- **Excel Data Import**: Upload, analyze, and profile Excel data
- **Working Papers**: Automated leadsheet generation and financial analysis
- **Document Management**: Secure document submission and categorization
- **Bilingual**: Full English and Arabic support with RTL
- **Activity Logging**: Complete audit trail of user actions

## Prerequisites

- dfx (DFINITY Canister SDK) v0.15.0+
- Rust 1.70+
- Node.js 18+
- npm or yarn

## Installation

### Install dfx
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

### Install dependencies
```bash
# Install Rust dependencies
cargo build --target wasm32-unknown-unknown --release

# Install frontend dependencies
cd frontend && npm install
```

## Development

### Start local replica
```bash
dfx start --clean --background
```

### Deploy Internet Identity
```bash
dfx deploy internet_identity
```

### Deploy backend canister
```bash
dfx deploy backend
```

### Build and deploy frontend
```bash
cd frontend
npm run build
cd ..
dfx deploy frontend
```

### Run development server
```bash
cd frontend
npm run dev
```

## Project Structure

```
AuditorBox/
├── backend/
│   ├── src/
│   │   ├── lib.rs              # Main canister entry
│   │   ├── types.rs            # Data structures
│   │   ├── storage.rs          # Stable storage
│   │   ├── auth.rs             # Authentication & authorization
│   │   ├── organizations.rs    # Organization management
│   │   ├── entities.rs         # Entity management
│   │   ├── clients.rs          # Client management
│   │   ├── engagements.rs      # Engagement management
│   │   ├── data_import.rs      # Excel import & profiling
│   │   ├── working_papers.rs   # Working paper generation
│   │   ├── documents.rs        # Document management
│   │   └── activity_log.rs     # Activity tracking
│   ├── Cargo.toml
│   └── backend.did
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   ├── i18n/               # Translations
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Helper functions
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── vite.config.ts
└── dfx.json

```

## Architecture

### Backend (Rust)
- Rust canisters on Internet Computer
- Stable storage using `ic-stable-structures`
- Excel parsing with `calamine`
- Role-based access control

### Frontend (React + TypeScript)
- React 18 with TypeScript
- Material-UI for components
- i18next for bilingual support
- React Router for navigation
- dfinity/agent for IC integration
- Vite 7 for fast builds

### Security Note
Excel parsing is handled entirely by the backend using Rust's `calamine` library for enhanced security. The frontend only uploads raw file bytes.

## Deployment

### Mainnet Deployment
```bash
dfx deploy --network ic
```

### Update Canister
```bash
dfx canister --network ic install backend --mode upgrade
```

## License

Proprietary - All rights reserved

