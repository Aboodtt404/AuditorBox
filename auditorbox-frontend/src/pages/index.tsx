// Navigation index — auto-generated
// Generated: 2026-02-08T19:16:01.411236

import React, { useState } from 'react';
import { CompleteProfilePage } from './CompleteProfilePage';
import { AdjustmentPage } from './AdjustmentPage';
import { EngagementPage } from './EngagementPage';
import { FinancialStatementPage } from './FinancialStatementPage';
import { OrganizationPage } from './OrganizationPage';
import { TrialBalancePage } from './TrialBalancePage';
import { AuditTrailPage } from './AuditTrailPage';
import { CurrentUserPage } from './CurrentUserPage';
import { UserPage } from './UserPage';

const pages = [
  { name: 'CompleteProfile', component: CompleteProfilePage },
  { name: 'Adjustment', component: AdjustmentPage },
  { name: 'Engagement', component: EngagementPage },
  { name: 'FinancialStatement', component: FinancialStatementPage },
  { name: 'Organization', component: OrganizationPage },
  { name: 'TrialBalance', component: TrialBalancePage },
  { name: 'AuditTrail', component: AuditTrailPage },
  { name: 'CurrentUser', component: CurrentUserPage },
  { name: 'User', component: UserPage },
];

export const PagesNav: React.FC = () => {
  const [active, setActive] = useState(0);
  const ActivePage = pages[active].component;
  return (
    <div>
      <nav className="flex gap-2 p-4 border-b border-gray-700">
        {pages.map((p, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`px-4 py-2 rounded ${active === i ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
            {p.name}
          </button>
        ))}
      </nav>
      <ActivePage />
    </div>
  );
};