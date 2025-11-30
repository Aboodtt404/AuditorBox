// Egyptian Audit Standards Metadata
// Based on ISA 2015 / ESAROAS (Egyptian Standards on Auditing, Review, and Other Assurance Services)

export interface StandardMetadata {
  code: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  keyRequirements: string[];
  keyRequirementsAr: string[];
  documentationNeeds: string[];
  documentationNeedsAr: string[];
}

export const EGYPTIAN_STANDARDS: StandardMetadata[] = [
  {
    code: 'ISA 200',
    name: 'Overall Objectives of the Independent Auditor',
    nameAr: 'الأهداف العامة للمراجع المستقل',
    description: 'Establishes the overall responsibilities of the independent auditor when conducting an audit of financial statements in accordance with ISAs.',
    descriptionAr: 'يحدد المسؤوليات العامة للمراجع المستقل عند إجراء مراجعة للقوائم المالية وفقًا لمعايير المراجعة الدولية.',
    category: 'General Principles and Responsibilities',
    categoryAr: 'المبادئ والمسؤوليات العامة',
    keyRequirements: [
      'Maintain independence and ethical requirements',
      'Exercise professional skepticism and judgment',
      'Obtain sufficient appropriate audit evidence',
      'Reduce audit risk to acceptably low level',
    ],
    keyRequirementsAr: [
      'الحفاظ على الاستقلالية والمتطلبات الأخلاقية',
      'ممارسة الشك المهني والحكم المهني',
      'الحصول على أدلة مراجعة كافية ومناسبة',
      'تخفيض مخاطر المراجعة إلى مستوى منخفض مقبول',
    ],
    documentationNeeds: [
      'Independence declaration',
      'Ethical compliance checklist',
      'Professional judgment documentation',
      'Audit evidence summary',
    ],
    documentationNeedsAr: [
      'إقرار الاستقلالية',
      'قائمة الامتثال الأخلاقي',
      'توثيق الحكم المهني',
      'ملخص أدلة المراجعة',
    ],
  },
  {
    code: 'ISA 210',
    name: 'Agreeing the Terms of Audit Engagements',
    nameAr: 'الاتفاق على شروط ارتباطات المراجعة',
    description: 'Deals with the auditor\'s responsibilities in agreeing the terms of the audit engagement with management and those charged with governance.',
    descriptionAr: 'يتناول مسؤوليات المراجع في الاتفاق على شروط ارتباط المراجعة مع الإدارة والمكلفين بالحوكمة.',
    category: 'General Principles and Responsibilities',
    categoryAr: 'المبادئ والمسؤوليات العامة',
    keyRequirements: [
      'Establish preconditions for audit are present',
      'Agree terms of audit engagement in writing',
      'Obtain management acknowledgment of responsibilities',
      'Document engagement terms in engagement letter',
    ],
    keyRequirementsAr: [
      'التأكد من توافر الشروط المسبقة للمراجعة',
      'الاتفاق على شروط ارتباط المراجعة كتابيًا',
      'الحصول على إقرار الإدارة بمسؤولياتها',
      'توثيق شروط الارتباط في خطاب الارتباط',
    ],
    documentationNeeds: [
      'Signed engagement letter',
      'Preconditions assessment',
      'Management responsibility acknowledgment',
      'Terms of reference document',
    ],
    documentationNeedsAr: [
      'خطاب ارتباط موقع',
      'تقييم الشروط المسبقة',
      'إقرار مسؤوليات الإدارة',
      'وثيقة الاختصاصات',
    ],
  },
  {
    code: 'ISA 220',
    name: 'Quality Control for an Audit of Financial Statements',
    nameAr: 'رقابة الجودة لمراجعة القوائم المالية',
    description: 'Addresses the specific responsibilities of the auditor regarding quality control procedures for an audit of financial statements.',
    descriptionAr: 'يتناول المسؤوليات المحددة للمراجع فيما يتعلق بإجراءات رقابة الجودة لمراجعة القوائم المالية.',
    category: 'General Principles and Responsibilities',
    categoryAr: 'المبادئ والمسؤوليات العامة',
    keyRequirements: [
      'Implement quality control procedures at engagement level',
      'Assign team with appropriate competence and capabilities',
      'Perform engagement quality control review',
      'Take responsibility for overall quality of engagement',
    ],
    keyRequirementsAr: [
      'تنفيذ إجراءات رقابة الجودة على مستوى الارتباط',
      'تعيين فريق بكفاءة وقدرات مناسبة',
      'إجراء مراجعة رقابة جودة الارتباط',
      'تحمل المسؤولية عن الجودة الشاملة للارتباط',
    ],
    documentationNeeds: [
      'Team competence assessment',
      'Quality control review checklist',
      'Engagement quality control review report',
      'Partner review documentation',
      'Consultation records',
    ],
    documentationNeedsAr: [
      'تقييم كفاءة الفريق',
      'قائمة مراجعة رقابة الجودة',
      'تقرير مراجعة رقابة جودة الارتباط',
      'توثيق مراجعة الشريك',
      'سجلات الاستشارات',
    ],
  },
  {
    code: 'ISA 230',
    name: 'Audit Documentation',
    nameAr: 'توثيق المراجعة',
    description: 'Addresses the auditor\'s responsibility to prepare audit documentation for an audit of financial statements.',
    descriptionAr: 'يتناول مسؤولية المراجع في إعداد توثيق المراجعة لمراجعة القوائم المالية.',
    category: 'General Principles and Responsibilities',
    categoryAr: 'المبادئ والمسؤوليات العامة',
    keyRequirements: [
      'Prepare documentation on timely basis',
      'Document sufficient detail to enable understanding',
      'Complete documentation within 60 days of report date',
      'Document departures from requirements',
    ],
    keyRequirementsAr: [
      'إعداد التوثيق في الوقت المناسب',
      'توثيق تفاصيل كافية لتمكين الفهم',
      'إكمال التوثيق خلال 60 يومًا من تاريخ التقرير',
      'توثيق الانحرافات عن المتطلبات',
    ],
    documentationNeeds: [
      'Complete audit file',
      'Working papers for all audit areas',
      'Audit completion checklist',
      'File completion sign-off',
      'Departures documentation',
    ],
    documentationNeedsAr: [
      'ملف مراجعة كامل',
      'أوراق عمل لجميع مجالات المراجعة',
      'قائمة إكمال المراجعة',
      'توقيع إكمال الملف',
      'توثيق الانحرافات',
    ],
  },
  {
    code: 'ISA 240',
    name: 'The Auditor\'s Responsibilities Relating to Fraud',
    nameAr: 'مسؤوليات المراجع المتعلقة بالاحتيال',
    description: 'Addresses the auditor\'s responsibilities relating to fraud in an audit of financial statements.',
    descriptionAr: 'يتناول مسؤوليات المراجع المتعلقة بالاحتيال في مراجعة القوائم المالية.',
    category: 'Risk Assessment and Response',
    categoryAr: 'تقييم المخاطر والاستجابة',
    keyRequirements: [
      'Identify and assess risks of material misstatement due to fraud',
      'Obtain information through inquiries',
      'Design procedures to address fraud risks',
      'Evaluate audit evidence for fraud indicators',
      'Obtain written representations on fraud',
    ],
    keyRequirementsAr: [
      'تحديد وتقييم مخاطر الأخطاء الجوهرية بسبب الاحتيال',
      'الحصول على المعلومات من خلال الاستفسارات',
      'تصميم إجراءات لمعالجة مخاطر الاحتيال',
      'تقييم أدلة المراجعة لمؤشرات الاحتيال',
      'الحصول على إقرارات كتابية بشأن الاحتيال',
    ],
    documentationNeeds: [
      'Fraud risk assessment',
      'Fraud brainstorming session notes',
      'Journal entry testing documentation',
      'Management fraud inquiries',
      'Fraud representation letters',
    ],
    documentationNeedsAr: [
      'تقييم مخاطر الاحتيال',
      'ملاحظات جلسة العصف الذهني للاحتيال',
      'توثيق اختبار القيود اليومية',
      'استفسارات الإدارة عن الاحتيال',
      'خطابات الإقرار بالاحتيال',
    ],
  },
  {
    code: 'ISA 250',
    name: 'Consideration of Laws and Regulations in an Audit',
    nameAr: 'مراعاة القوانين واللوائح في المراجعة',
    description: 'Addresses the auditor\'s responsibility to consider laws and regulations in an audit of financial statements.',
    descriptionAr: 'يتناول مسؤولية المراجع في مراعاة القوانين واللوائح في مراجعة القوائم المالية.',
    category: 'Risk Assessment and Response',
    categoryAr: 'تقييم المخاطر والاستجابة',
    keyRequirements: [
      'Obtain understanding of legal and regulatory framework',
      'Perform procedures to identify noncompliance',
      'Respond to identified noncompliance',
      'Evaluate effect on financial statements',
    ],
    keyRequirementsAr: [
      'الحصول على فهم للإطار القانوني والتنظيمي',
      'تنفيذ إجراءات لتحديد عدم الامتثال',
      'الاستجابة لعدم الامتثال المحدد',
      'تقييم التأثير على القوائم المالية',
    ],
    documentationNeeds: [
      'Legal and regulatory framework summary',
      'Compliance procedures documentation',
      'Legal correspondence review',
      'Attorney letters',
      'Noncompliance assessment',
    ],
    documentationNeedsAr: [
      'ملخص الإطار القانوني والتنظيمي',
      'توثيق إجراءات الامتثال',
      'مراجعة المراسلات القانونية',
      'خطابات المحامين',
      'تقييم عدم الامتثال',
    ],
  },
  {
    code: 'ISA 260',
    name: 'Communication with Those Charged with Governance',
    nameAr: 'الاتصال مع المكلفين بالحوكمة',
    description: 'Addresses the auditor\'s responsibility to communicate with those charged with governance in an audit of financial statements.',
    descriptionAr: 'يتناول مسؤولية المراجع في الاتصال مع المكلفين بالحوكمة في مراجعة القوائم المالية.',
    category: 'Reporting',
    categoryAr: 'إعداد التقارير',
    keyRequirements: [
      'Establish communication process with governance',
      'Communicate auditor responsibilities and planned scope',
      'Communicate significant findings from audit',
      'Communicate on timely basis',
    ],
    keyRequirementsAr: [
      'إنشاء عملية اتصال مع الحوكمة',
      'إبلاغ مسؤوليات المراجع والنطاق المخطط',
      'إبلاغ النتائج الهامة من المراجعة',
      'الاتصال في الوقت المناسب',
    ],
    documentationNeeds: [
      'Governance communication plan',
      'Initial communication letter',
      'Communication to governance letter',
      'Significant findings report',
      'Meeting minutes',
    ],
    documentationNeedsAr: [
      'خطة الاتصال بالحوكمة',
      'خطاب الاتصال الأولي',
      'خطاب الاتصال بالحوكمة',
      'تقرير النتائج الهامة',
      'محاضر الاجتماعات',
    ],
  },
  {
    code: 'ISA 265',
    name: 'Communicating Deficiencies in Internal Control',
    nameAr: 'إبلاغ أوجه القصور في الرقابة الداخلية',
    description: 'Addresses the auditor\'s responsibility to communicate appropriately to those charged with governance and management deficiencies in internal control.',
    descriptionAr: 'يتناول مسؤولية المراجع في إبلاغ المكلفين بالحوكمة والإدارة بشكل مناسب بأوجه القصور في الرقابة الداخلية.',
    category: 'Reporting',
    categoryAr: 'إعداد التقارير',
    keyRequirements: [
      'Identify deficiencies in internal control',
      'Evaluate whether deficiencies are significant',
      'Communicate significant deficiencies to governance',
      'Communicate other deficiencies to management',
    ],
    keyRequirementsAr: [
      'تحديد أوجه القصور في الرقابة الداخلية',
      'تقييم ما إذا كانت أوجه القصور جوهرية',
      'إبلاغ الحوكمة بأوجه القصور الجوهرية',
      'إبلاغ الإدارة بأوجه القصور الأخرى',
    ],
    documentationNeeds: [
      'Control deficiencies register',
      'Severity assessment',
      'Internal control communication letter',
      'Management letter with deficiencies',
    ],
    documentationNeedsAr: [
      'سجل أوجه القصور في الرقابة',
      'تقييم الخطورة',
      'خطاب اتصال الرقابة الداخلية',
      'خطاب الإدارة مع أوجه القصور',
    ],
  },
  {
    code: 'ISA 300',
    name: 'Planning an Audit of Financial Statements',
    nameAr: 'تخطيط مراجعة القوائم المالية',
    description: 'Addresses the auditor\'s responsibility to plan an audit of financial statements.',
    descriptionAr: 'يتناول مسؤولية المراجع في تخطيط مراجعة القوائم المالية.',
    category: 'Planning',
    categoryAr: 'التخطيط',
    keyRequirements: [
      'Establish overall audit strategy',
      'Develop detailed audit plan',
      'Plan direction, supervision, and review',
      'Update audit plan as necessary',
    ],
    keyRequirementsAr: [
      'وضع استراتيجية المراجعة الشاملة',
      'تطوير خطة مراجعة مفصلة',
      'التخطيط للتوجيه والإشراف والمراجعة',
      'تحديث خطة المراجعة حسب الحاجة',
    ],
    documentationNeeds: [
      'Overall audit strategy document',
      'Detailed audit plan',
      'Resource allocation plan',
      'Audit programs for each area',
      'Planning changes documentation',
    ],
    documentationNeedsAr: [
      'وثيقة استراتيجية المراجعة الشاملة',
      'خطة مراجعة مفصلة',
      'خطة تخصيص الموارد',
      'برامج المراجعة لكل مجال',
      'توثيق التغييرات في التخطيط',
    ],
  },
  {
    code: 'ISA 315',
    name: 'Identifying and Assessing the Risks of Material Misstatement',
    nameAr: 'تحديد وتقييم مخاطر الأخطاء الجوهرية',
    description: 'Addresses the auditor\'s responsibility to identify and assess the risks of material misstatement in the financial statements.',
    descriptionAr: 'يتناول مسؤولية المراجع في تحديد وتقييم مخاطر الأخطاء الجوهرية في القوائم المالية.',
    category: 'Risk Assessment and Response',
    categoryAr: 'تقييم المخاطر والاستجابة',
    keyRequirements: [
      'Perform risk assessment procedures',
      'Understand entity and its environment',
      'Understand internal control relevant to audit',
      'Identify and assess risks of material misstatement',
      'Document risk assessment process and results',
    ],
    keyRequirementsAr: [
      'تنفيذ إجراءات تقييم المخاطر',
      'فهم المنشأة وبيئتها',
      'فهم الرقابة الداخلية ذات الصلة بالمراجعة',
      'تحديد وتقييم مخاطر الأخطاء الجوهرية',
      'توثيق عملية ونتائج تقييم المخاطر',
    ],
    documentationNeeds: [
      'Risk assessment procedures documentation',
      'Entity understanding documentation',
      'Internal control documentation',
      'Risk assessment documentation',
      'Risk matrix',
      'Team discussion minutes',
    ],
    documentationNeedsAr: [
      'توثيق إجراءات تقييم المخاطر',
      'توثيق فهم المنشأة',
      'توثيق الرقابة الداخلية',
      'توثيق تقييم المخاطر',
      'مصفوفة المخاطر',
      'محاضر مناقشات الفريق',
    ],
  },
];

export function getStandardByCode(code: string): StandardMetadata | undefined {
  return EGYPTIAN_STANDARDS.find(s => s.code === code);
}

export function getStandardsByCategory(category: string): StandardMetadata[] {
  return EGYPTIAN_STANDARDS.filter(s => s.category === category);
}

export function getAllStandardCodes(): string[] {
  return EGYPTIAN_STANDARDS.map(s => s.code);
}

export const STANDARD_CATEGORIES = [
  'General Principles and Responsibilities',
  'Risk Assessment and Response',
  'Planning',
  'Reporting',
];

export const STANDARD_CATEGORIES_AR = [
  'المبادئ والمسؤوليات العامة',
  'تقييم المخاطر والاستجابة',
  'التخطيط',
  'إعداد التقارير',
];

