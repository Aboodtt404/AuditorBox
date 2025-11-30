import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Description as DocumentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { EGYPTIAN_STANDARDS, getStandardByCode } from '../data/egyptianStandards';

interface DocumentationTemplatesProps {
  standardCode?: string;
  onClose?: () => void;
}

export default function DocumentationTemplates({ standardCode, onClose }: DocumentationTemplatesProps) {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const standards = standardCode
    ? [getStandardByCode(standardCode)].filter(Boolean)
    : EGYPTIAN_STANDARDS;

  const generateDocument = (templateType: string, standard: typeof EGYPTIAN_STANDARDS[0]) => {
    // This would generate actual document content
    // For now, we'll create a structured template
    const templates: Record<string, string> = {
      'engagement-letter': generateEngagementLetter(standard),
      'fraud-assessment': generateFraudAssessment(standard),
      'risk-assessment': generateRiskAssessment(standard),
      'compliance-checklist': generateComplianceChecklist(standard),
      'materiality-memo': generateMaterialityMemo(standard),
      'quality-control': generateQualityControl(standard),
    };

    return templates[templateType] || '';
  };

  const generateEngagementLetter = (standard: typeof EGYPTIAN_STANDARDS[0]) => {
    return `ENGAGEMENT LETTER
Standard: ${standard.code} - ${standard.name}

[Date]

[Client Name]
[Client Address]

Dear [Client Name],

This letter confirms our understanding of the terms and objectives of our engagement and the nature and limitations of the services we will provide.

OBJECTIVE
The objective of our audit is to express an opinion on the financial statements based on our audit conducted in accordance with ${standard.code} and Egyptian Standards on Auditing.

SCOPE
Our audit will be conducted in accordance with:
- ${standard.code}: ${standard.name}
- Egyptian Standards on Auditing, Review, and Other Assurance Services (ESAROAS)

RESPONSIBILITIES
Management is responsible for:
- Preparation and fair presentation of the financial statements
- Establishing and maintaining effective internal control
- Providing us with access to all relevant information

AUDITOR RESPONSIBILITIES
Our responsibility is to express an opinion on the financial statements based on our audit.

[Signature]
[Auditor Name]
[Firm Name]`;
  };

  const generateFraudAssessment = (standard: typeof EGYPTIAN_STANDARDS[0]) => {
    if (standard.code !== 'ISA 240') return '';
    
    return `FRAUD RISK ASSESSMENT
Standard: ${standard.code} - ${standard.name}

Entity: [Entity Name]
Period: [Period]
Date: [Date]

FRAUD RISK FACTORS
1. Incentives/Pressures:
   [ ] Financial stability or profitability threatened
   [ ] Excessive pressure for performance
   [ ] Personal financial situation

2. Opportunities:
   [ ] Weak internal controls
   [ ] Complex transactions
   [ ] Significant related party transactions

3. Attitudes/Rationalizations:
   [ ] Management's attitude toward internal control
   [ ] Ineffective communication of values
   [ ] Known history of violations

ASSESSED FRAUD RISKS
[Document identified fraud risks]

RESPONSES TO FRAUD RISKS
[Document procedures designed to address fraud risks]

UNPREDICTABLE PROCEDURES
[Document unpredictable procedures incorporated]

MANAGEMENT OVERRIDE
[Document procedures to address management override]

Prepared by: [Name]
Reviewed by: [Name]
Date: [Date]`;
  };

  const generateRiskAssessment = (standard: typeof EGYPTIAN_STANDARDS[0]) => {
    if (standard.code !== 'ISA 315') return '';
    
    return `RISK ASSESSMENT WORKSHEET
Standard: ${standard.code} - ${standard.name}

Entity: [Entity Name]
Period: [Period]
Date: [Date]

ENTITY UNDERSTANDING
Industry: [Industry]
Regulatory Environment: [Regulatory factors]
Business Model: [Business model description]

SIGNIFICANT CLASSES
[Document significant classes of transactions, account balances, and disclosures]

INHERENT RISK FACTORS
Complexity: [Assessment]
Subjectivity: [Assessment]
Change: [Assessment]
Uncertainty: [Assessment]
Susceptibility: [Assessment]

ASSESSED RISKS
[Document identified risks of material misstatement]

SIGNIFICANT RISKS
[Document significant risks requiring special audit consideration]

CONTROLS EVALUATED
[Document controls evaluated for design and implementation]

RISK-PROCEDURE LINKAGE
[Document how procedures respond to assessed risks]

Prepared by: [Name]
Reviewed by: [Name]
Date: [Date]`;
  };

  const generateComplianceChecklist = (standard: typeof EGYPTIAN_STANDARDS[0]) => {
    return `COMPLIANCE CHECKLIST
Standard: ${standard.code} - ${standard.name}

Entity: [Entity Name]
Period: [Period]
Date: [Date]

KEY REQUIREMENTS:
${standard.keyRequirements.map((req, idx) => `${idx + 1}. [ ] ${req}`).join('\n')}

DOCUMENTATION REQUIRED:
${standard.documentationNeeds.map((doc, idx) => `${idx + 1}. [ ] ${doc}`).join('\n')}

COMPLIANCE STATUS: [ ] Compliant [ ] Partially Compliant [ ] Non-Compliant

NOTES:
[Document any issues or exceptions]

Prepared by: [Name]
Reviewed by: [Name]
Date: [Date]`;
  };

  const generateMaterialityMemo = (standard: typeof EGYPTIAN_STANDARDS[0]) => {
    if (!standard.code.includes('200')) return '';
    
    return `MATERIALITY MEMORANDUM
Standard: ${standard.code} - ${standard.name}

Entity: [Entity Name]
Period: [Period]
Date: [Date]

OVERALL MATERIALITY
Calculation Method: [Method]
Benchmark: [Benchmark]
Percentage: [Percentage]
Amount: [Amount]

PERFORMANCE MATERIALITY
Percentage of Overall Materiality: [Percentage]
Amount: [Amount]

TRIVIAL AMOUNT
Amount: [Amount]

REVISION
[Document any revisions to materiality and reasons]

JUSTIFICATION
[Document rationale for materiality determination]

Prepared by: [Name]
Reviewed by: [Name]
Date: [Date]`;
  };

  const generateQualityControl = (standard: typeof EGYPTIAN_STANDARDS[0]) => {
    if (standard.code !== 'ISA 220') return '';
    
    return `QUALITY CONTROL REVIEW
Standard: ${standard.code} - ${standard.name}

Engagement: [Engagement Name]
Period: [Period]
Date: [Date]

ENGAGEMENT TEAM
Partner: [Name]
Manager: [Name]
Senior: [Name]
Staff: [Names]

COMPETENCE ASSESSMENT
[Document team competence and capabilities]

SUPERVISION PLAN
[Document supervision and review plan]

ENGAGEMENT QUALITY CONTROL REVIEW
Required: [ ] Yes [ ] No
Reviewer: [Name]
Date Completed: [Date]

INDEPENDENCE
[Document independence confirmations]

CONSULTATIONS
[Document any consultations on difficult matters]

Prepared by: [Name]
Reviewed by: [Name]
Date: [Date]`;
  };

  const handleDownload = (templateType: string, standard: typeof EGYPTIAN_STANDARDS[0]) => {
    const content = generateDocument(templateType, standard);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${standard.code}-${templateType}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTemplatesForStandard = (standard: typeof EGYPTIAN_STANDARDS[0]) => {
    const templates: Array<{ id: string; name: string; description: string }> = [];

    if (standard.code === 'ISA 200') {
      templates.push(
        { id: 'materiality-memo', name: 'Materiality Memorandum', description: 'Document materiality calculations and thresholds' },
        { id: 'engagement-letter', name: 'Engagement Letter', description: 'Standard engagement letter template' }
      );
    }
    if (standard.code === 'ISA 210') {
      templates.push(
        { id: 'engagement-letter', name: 'Engagement Letter', description: 'Engagement terms and conditions' },
        { id: 'acceptance-form', name: 'Acceptance Form', description: 'Client acceptance checklist' }
      );
    }
    if (standard.code === 'ISA 220') {
      templates.push(
        { id: 'quality-control', name: 'Quality Control Review', description: 'Quality control documentation' },
        { id: 'supervision-plan', name: 'Supervision Plan', description: 'Team supervision and review plan' }
      );
    }
    if (standard.code === 'ISA 230') {
      templates.push(
        { id: 'file-completion', name: 'File Completion Checklist', description: 'Audit file assembly checklist' },
        { id: 'documentation-guide', name: 'Documentation Guide', description: 'Working paper documentation requirements' }
      );
    }
    if (standard.code === 'ISA 240') {
      templates.push(
        { id: 'fraud-assessment', name: 'Fraud Risk Assessment', description: 'Fraud risk identification and assessment' },
        { id: 'journal-testing', name: 'Journal Entry Testing', description: 'Journal entry testing program' }
      );
    }
    if (standard.code === 'ISA 250') {
      templates.push(
        { id: 'compliance-checklist', name: 'Legal Compliance Checklist', description: 'Laws and regulations compliance' },
        { id: 'noncompliance-memo', name: 'Non-Compliance Memo', description: 'Document non-compliance issues' }
      );
    }
    if (standard.code === 'ISA 260') {
      templates.push(
        { id: 'governance-letter', name: 'Governance Communication Letter', description: 'Communication to those charged with governance' },
        { id: 'significant-findings', name: 'Significant Findings Report', description: 'Report of significant audit findings' }
      );
    }
    if (standard.code === 'ISA 265') {
      templates.push(
        { id: 'deficiency-matrix', name: 'Control Deficiency Matrix', description: 'Internal control deficiencies register' },
        { id: 'management-letter', name: 'Management Letter', description: 'Communication of control deficiencies' }
      );
    }
    if (standard.code === 'ISA 300') {
      templates.push(
        { id: 'audit-strategy', name: 'Audit Strategy Document', description: 'Overall audit strategy' },
        { id: 'audit-plan', name: 'Detailed Audit Plan', description: 'Detailed audit procedures plan' }
      );
    }
    if (standard.code === 'ISA 315') {
      templates.push(
        { id: 'risk-assessment', name: 'Risk Assessment Worksheet', description: 'Risk identification and assessment' },
        { id: 'entity-understanding', name: 'Entity Understanding Memo', description: 'Understanding of entity and environment' }
      );
    }

    return templates;
  };

  return (
    <Box>
      {standards.map((standard) => {
        if (!standard) return null;
        const templates = getTemplatesForStandard(standard);

        return (
          <Paper key={standard.code} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {standard.code} - {standard.name}
            </Typography>
            <List>
              {templates.map((template) => (
                <ListItem key={template.id} disablePadding>
                  <ListItemButton onClick={() => handleDownload(template.id, standard)}>
                    <ListItemIcon>
                      <DocumentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={template.name}
                      secondary={template.description}
                    />
                    <IconButton edge="end" onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(template.id, standard);
                    }}>
                      <DownloadIcon />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        );
      })}
    </Box>
  );
}

