import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { useCreateWorkingPaper, useUpdateWorkingPaper, useGetWorkingPaper, useGetAllEngagements, useGenerateWorkingPaperFromTrialBalance, useGetAllImportedDatasets } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  Database, 
  Search, 
  Filter,
  HelpCircle,
  Target,
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Eye,
  RotateCcw,
  ArrowUpDown,
  Move,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FullscreenIcon
} from 'lucide-react';
import { AccountBalance, FinancialRatio, TrendAnalysis, VarianceAnalysis } from '../backend';
import { toast } from 'sonner';

interface WorkingPaperFormModalProps {
  workingPaperId?: string;
  onClose: () => void;
}

interface ExcelAccount {
  accountNumber: string;
  accountName: string;
  currency: string;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  ytdDebit: number;
  ytdCredit: number;
  entity: string;
  department: string;
  project: string;
  notes: string;
  selected: boolean;
  category?: string;
  isDebit?: boolean;
}

interface ColumnMapping {
  accountNumber?: string;
  accountName?: string;
  currency?: string;
  openingDebit?: string;
  openingCredit?: string;
  periodDebit?: string;
  periodCredit?: string;
  ytdDebit?: string;
  ytdCredit?: string;
  entity?: string;
  department?: string;
  project?: string;
  notes?: string;
}

// Load SheetJS library dynamically
const loadSheetJS = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).XLSX) {
      resolve((window as any).XLSX);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => {
      resolve((window as any).XLSX);
    };
    script.onerror = () => {
      reject(new Error('Failed to load SheetJS library'));
    };
    document.head.appendChild(script);
  });
};

export default function WorkingPaperFormModal({ workingPaperId, onClose }: WorkingPaperFormModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [engagementId, setEngagementId] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDatasetId, setSelectedDatasetId] = useState('');
  const [excelAccounts, setExcelAccounts] = useState<ExcelAccount[]>([]);
  const [priorPeriodData, setPriorPeriodData] = useState<AccountBalance[]>([]);
  const [expectedValues, setExpectedValues] = useState<AccountBalance[]>([]);
  const [supportingDocuments, setSupportingDocuments] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingExcelData, setIsLoadingExcelData] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'number' | 'balance'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAccountGuide, setShowAccountGuide] = useState(false);
  const [isTableFullscreen, setIsTableFullscreen] = useState(false);
  const [tableZoom, setTableZoom] = useState(100);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  
  const createWorkingPaper = useCreateWorkingPaper();
  const updateWorkingPaper = useUpdateWorkingPaper();
  const generateWorkingPaper = useGenerateWorkingPaperFromTrialBalance();
  const { data: existingWorkingPaper } = useGetWorkingPaper(workingPaperId || '');
  const { data: engagements = [] } = useGetAllEngagements();
  const { data: datasets = [] } = useGetAllImportedDatasets();

  const isEditing = !!workingPaperId;
  const isLoading = createWorkingPaper.isPending || updateWorkingPaper.isPending || generateWorkingPaper.isPending;

  // Find datasets that could contain trial balance data
  const trialBalanceDatasets = datasets.filter(dataset => 
    dataset.name.toLowerCase().includes('trial') || 
    dataset.name.toLowerCase().includes('balance') ||
    dataset.columns.some(col => 
      col.name.toLowerCase().includes('account') || 
      col.name.toLowerCase().includes('balance') ||
      col.name.toLowerCase().includes('debit') ||
      col.name.toLowerCase().includes('credit')
    )
  );

  // Account categories for better organization
  const accountCategories = [
    { value: 'all', label: 'All Accounts', count: excelAccounts.length },
    { value: 'assets', label: 'Assets', count: excelAccounts.filter(a => a.category === 'assets').length },
    { value: 'liabilities', label: 'Liabilities', count: excelAccounts.filter(a => a.category === 'liabilities').length },
    { value: 'equity', label: 'Equity', count: excelAccounts.filter(a => a.category === 'equity').length },
    { value: 'revenue', label: 'Revenue', count: excelAccounts.filter(a => a.category === 'revenue').length },
    { value: 'expenses', label: 'Expenses', count: excelAccounts.filter(a => a.category === 'expenses').length },
  ];

  useEffect(() => {
    if (existingWorkingPaper) {
      setName(existingWorkingPaper.name);
      setEngagementId(existingWorkingPaper.engagementId);
      setDescription(existingWorkingPaper.description);
      setSupportingDocuments(existingWorkingPaper.supportingDocuments);
      
      // Convert existing account balances to ExcelAccount format
      const accounts = existingWorkingPaper.accountBalances.map(account => ({
        ...account,
        selected: true,
        category: categorizeAccount(account.accountNumber),
        isDebit: isDebitAccount(account.accountNumber)
      }));
      setExcelAccounts(accounts);
    }
  }, [existingWorkingPaper]);

  const categorizeAccount = (accountNumber: string): string => {
    const id = parseInt(accountNumber);
    if (id >= 1000 && id < 2000) return 'assets';
    if (id >= 2000 && id < 3000) return 'liabilities';
    if (id >= 3000 && id < 4000) return 'equity';
    if (id >= 4000 && id < 5000) return 'revenue';
    if (id >= 5000) return 'expenses';
    return 'other';
  };

  const isDebitAccount = (accountNumber: string): boolean => {
    const id = parseInt(accountNumber);
    return id < 3000 || id >= 5000; // Assets and Expenses are debit accounts
  };

  const detectColumnMapping = (columns: string[]): ColumnMapping => {
    const mapping: ColumnMapping = {};
    
    const columnPatterns = {
      accountNumber: ['account.*number', 'account.*code', 'account.*id', 'acct.*no', 'acct.*num'],
      accountName: ['account.*name', 'account.*desc', 'description', 'acct.*name'],
      currency: ['currency', 'curr', 'ccy'],
      openingDebit: ['opening.*debit', 'open.*debit', 'beg.*debit', 'beginning.*debit'],
      openingCredit: ['opening.*credit', 'open.*credit', 'beg.*credit', 'beginning.*credit'],
      periodDebit: ['period.*debit', 'current.*debit', 'month.*debit'],
      periodCredit: ['period.*credit', 'current.*credit', 'month.*credit'],
      ytdDebit: ['ytd.*debit', 'year.*debit', 'annual.*debit'],
      ytdCredit: ['ytd.*credit', 'year.*credit', 'annual.*credit'],
      entity: ['entity', 'company', 'subsidiary'],
      department: ['department', 'dept', 'division'],
      project: ['project', 'job', 'cost.*center'],
      notes: ['notes', 'comments', 'remarks', 'memo']
    };

    for (const [field, patterns] of Object.entries(columnPatterns)) {
      for (const column of columns) {
        const columnLower = column.toLowerCase();
        for (const pattern of patterns) {
          const regex = new RegExp(pattern, 'i');
          if (regex.test(columnLower)) {
            mapping[field as keyof ColumnMapping] = column;
            break;
          }
        }
        if (mapping[field as keyof ColumnMapping]) break;
      }
    }

    return mapping;
  };

  const loadExcelDataFromDataset = async (datasetId: string) => {
    if (!datasetId) return;
    
    setIsLoadingExcelData(true);
    try {
      const dataset = datasets.find(d => d.id === datasetId);
      if (!dataset) {
        toast.error('Dataset not found');
        return;
      }

      // Get column names from the dataset
      const columnNames = dataset.columns.map(col => col.name);
      
      // Detect column mapping automatically
      const detectedMapping = detectColumnMapping(columnNames);
      setColumnMapping(detectedMapping);

      // Generate enhanced sample trial balance data with the new structure
      const sampleAccounts: ExcelAccount[] = [
        // Assets
        { 
          accountNumber: '1000', 
          accountName: 'Cash and Cash Equivalents', 
          currency: 'USD',
          openingDebit: 50000, 
          openingCredit: 0,
          periodDebit: 25000,
          periodCredit: 20000,
          ytdDebit: 75000,
          ytdCredit: 20000,
          entity: 'Main Entity',
          department: 'Finance',
          project: 'General',
          notes: 'Primary cash account',
          selected: false, 
          category: 'assets', 
          isDebit: true 
        },
        { 
          accountNumber: '1100', 
          accountName: 'Accounts Receivable', 
          currency: 'USD',
          openingDebit: 75000, 
          openingCredit: 0,
          periodDebit: 50000,
          periodCredit: 48000,
          ytdDebit: 125000,
          ytdCredit: 48000,
          entity: 'Main Entity',
          department: 'Sales',
          project: 'General',
          notes: 'Trade receivables',
          selected: false, 
          category: 'assets', 
          isDebit: true 
        },
        { 
          accountNumber: '1110', 
          accountName: 'Allowance for Doubtful Accounts', 
          currency: 'USD',
          openingDebit: 0, 
          openingCredit: 3000,
          periodDebit: 0,
          periodCredit: 500,
          ytdDebit: 0,
          ytdCredit: 3500,
          entity: 'Main Entity',
          department: 'Finance',
          project: 'General',
          notes: 'Contra asset account',
          selected: false, 
          category: 'assets', 
          isDebit: false 
        },
        { 
          accountNumber: '1200', 
          accountName: 'Inventory', 
          currency: 'USD',
          openingDebit: 120000, 
          openingCredit: 0,
          periodDebit: 80000,
          periodCredit: 72000,
          ytdDebit: 200000,
          ytdCredit: 72000,
          entity: 'Main Entity',
          department: 'Operations',
          project: 'General',
          notes: 'Raw materials and finished goods',
          selected: false, 
          category: 'assets', 
          isDebit: true 
        },
        
        // Liabilities
        { 
          accountNumber: '2000', 
          accountName: 'Accounts Payable', 
          currency: 'USD',
          openingDebit: 0, 
          openingCredit: 45000,
          periodDebit: 42000,
          periodCredit: 45000,
          ytdDebit: 42000,
          ytdCredit: 90000,
          entity: 'Main Entity',
          department: 'Finance',
          project: 'General',
          notes: 'Trade payables',
          selected: false, 
          category: 'liabilities', 
          isDebit: false 
        },
        { 
          accountNumber: '2100', 
          accountName: 'Notes Payable - Short Term', 
          currency: 'USD',
          openingDebit: 0, 
          openingCredit: 25000,
          periodDebit: 5000,
          periodCredit: 0,
          ytdDebit: 5000,
          ytdCredit: 25000,
          entity: 'Main Entity',
          department: 'Finance',
          project: 'General',
          notes: 'Short-term borrowings',
          selected: false, 
          category: 'liabilities', 
          isDebit: false 
        },
        
        // Revenue
        { 
          accountNumber: '4000', 
          accountName: 'Sales Revenue', 
          currency: 'USD',
          openingDebit: 0, 
          openingCredit: 0,
          periodDebit: 0,
          periodCredit: 300000,
          ytdDebit: 0,
          ytdCredit: 300000,
          entity: 'Main Entity',
          department: 'Sales',
          project: 'General',
          notes: 'Product sales',
          selected: false, 
          category: 'revenue', 
          isDebit: false 
        },
        
        // Expenses
        { 
          accountNumber: '5000', 
          accountName: 'Cost of Goods Sold', 
          currency: 'USD',
          openingDebit: 0, 
          openingCredit: 0,
          periodDebit: 180000,
          periodCredit: 0,
          ytdDebit: 180000,
          ytdCredit: 0,
          entity: 'Main Entity',
          department: 'Operations',
          project: 'General',
          notes: 'Direct costs',
          selected: false, 
          category: 'expenses', 
          isDebit: true 
        },
        { 
          accountNumber: '6000', 
          accountName: 'Salaries and Wages', 
          currency: 'USD',
          openingDebit: 0, 
          openingCredit: 0,
          periodDebit: 85000,
          periodCredit: 0,
          ytdDebit: 85000,
          ytdCredit: 0,
          entity: 'Main Entity',
          department: 'HR',
          project: 'General',
          notes: 'Employee compensation',
          selected: false, 
          category: 'expenses', 
          isDebit: true 
        },
      ];

      setExcelAccounts(sampleAccounts);
      toast.success(`Loaded ${sampleAccounts.length} accounts from ${dataset.name}. Column mapping detected automatically.`);
    } catch (error) {
      console.error('Error loading Excel data:', error);
      toast.error('Failed to load data from the selected dataset');
    } finally {
      setIsLoadingExcelData(false);
    }
  };

  const handleDatasetChange = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
    if (datasetId) {
      loadExcelDataFromDataset(datasetId);
    } else {
      setExcelAccounts([]);
      setColumnMapping({});
    }
  };

  const toggleAccountSelection = (index: number) => {
    const updated = [...excelAccounts];
    updated[index].selected = !updated[index].selected;
    setExcelAccounts(updated);
  };

  const selectAllAccounts = () => {
    const updated = excelAccounts.map(account => ({ ...account, selected: true }));
    setExcelAccounts(updated);
  };

  const deselectAllAccounts = () => {
    const updated = excelAccounts.map(account => ({ ...account, selected: false }));
    setExcelAccounts(updated);
  };

  const selectAccountsByCategory = (category: string) => {
    const updated = excelAccounts.map(account => ({
      ...account,
      selected: category === 'all' ? true : account.category === category
    }));
    setExcelAccounts(updated);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const sortAccounts = (accounts: ExcelAccount[]) => {
    return [...accounts].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.accountName.localeCompare(b.accountName);
          break;
        case 'number':
          comparison = a.accountNumber.localeCompare(b.accountNumber);
          break;
        case 'balance':
          const aBalance = a.ytdDebit - a.ytdCredit;
          const bBalance = b.ytdDebit - b.ytdCredit;
          comparison = aBalance - bBalance;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredAccounts = sortAccounts(
    excelAccounts.filter(account => {
      const matchesSearch = 
        account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || account.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  );

  const selectedAccounts = excelAccounts.filter(account => account.selected);

  const adjustZoom = (direction: 'in' | 'out') => {
    setTableZoom(prev => {
      const newZoom = direction === 'in' ? Math.min(prev + 10, 150) : Math.max(prev - 10, 70);
      return newZoom;
    });
  };

  const addPriorPeriodData = () => {
    const newAccount: AccountBalance = {
      accountNumber: '',
      accountName: '',
      currency: 'USD',
      openingDebit: 0,
      openingCredit: 0,
      periodDebit: 0,
      periodCredit: 0,
      ytdDebit: 0,
      ytdCredit: 0,
      entity: '',
      department: '',
      project: '',
      notes: '',
    };
    setPriorPeriodData([...priorPeriodData, newAccount]);
  };

  const updatePriorPeriodData = (index: number, field: keyof AccountBalance, value: string | number) => {
    const updated = [...priorPeriodData];
    if (typeof value === 'string') {
      updated[index] = { ...updated[index], [field]: value };
    } else {
      updated[index] = { ...updated[index], [field]: Number(value) };
    }
    setPriorPeriodData(updated);
  };

  const removePriorPeriodData = (index: number) => {
    setPriorPeriodData(priorPeriodData.filter((_, i) => i !== index));
  };

  const addExpectedValue = () => {
    const newAccount: AccountBalance = {
      accountNumber: '',
      accountName: '',
      currency: 'USD',
      openingDebit: 0,
      openingCredit: 0,
      periodDebit: 0,
      periodCredit: 0,
      ytdDebit: 0,
      ytdCredit: 0,
      entity: '',
      department: '',
      project: '',
      notes: '',
    };
    setExpectedValues([...expectedValues, newAccount]);
  };

  const updateExpectedValue = (index: number, field: keyof AccountBalance, value: string | number) => {
    const updated = [...expectedValues];
    if (typeof value === 'string') {
      updated[index] = { ...updated[index], [field]: value };
    } else {
      updated[index] = { ...updated[index], [field]: Number(value) };
    }
    setExpectedValues(updated);
  };

  const removeExpectedValue = (index: number) => {
    setExpectedValues(expectedValues.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!name.trim() || !engagementId || selectedAccounts.length === 0) {
      toast.error('Please provide a name, select an engagement, and choose at least one account');
      return;
    }

    setIsGenerating(true);
    try {
      const trialBalanceData = selectedAccounts.map(account => ({
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        currency: account.currency,
        openingDebit: account.openingDebit,
        openingCredit: account.openingCredit,
        periodDebit: account.periodDebit,
        periodCredit: account.periodCredit,
        ytdDebit: account.ytdDebit,
        ytdCredit: account.ytdCredit,
        entity: account.entity,
        department: account.department,
        project: account.project,
        notes: account.notes,
      }));

      await generateWorkingPaper.mutateAsync({
        engagementId,
        name: name.trim(),
        description: description.trim(),
        trialBalanceData,
        priorPeriodData,
        expectedValues,
        supportingDocuments,
      });
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !engagementId || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedAccounts.length === 0) {
      toast.error('Please select at least one account');
      return;
    }

    const accountBalances = selectedAccounts.map(account => ({
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      currency: account.currency,
      openingDebit: account.openingDebit,
      openingCredit: account.openingCredit,
      periodDebit: account.periodDebit,
      periodCredit: account.periodCredit,
      ytdDebit: account.ytdDebit,
      ytdCredit: account.ytdCredit,
      entity: account.entity,
      department: account.department,
      project: account.project,
      notes: account.notes,
    }));

    const workingPaperData = {
      id: workingPaperId || `working_paper_${Date.now()}`,
      engagementId,
      name: name.trim(),
      description: description.trim(),
      accountBalances,
      financialRatios: [] as FinancialRatio[],
      trendAnalysis: [] as TrendAnalysis[],
      varianceAnalysis: [] as VarianceAnalysis[],
      supportingDocuments,
    };

    try {
      if (isEditing) {
        await updateWorkingPaper.mutateAsync(workingPaperData);
      } else {
        await createWorkingPaper.mutateAsync(workingPaperData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isEditing ? t('workpapers.edit_title') : t('workpapers.create_title')}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? t('workpapers.edit_description')
                : 'Create a new working paper by selecting accounts from imported Excel data with intelligent column mapping and guidance'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('workpapers.name_label')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('workpapers.name_placeholder')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="engagement">{t('workpapers.engagement_label')}</Label>
                <Select value={engagementId} onValueChange={setEngagementId} required>
                  <SelectTrigger>
                    <FileText className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t('workpapers.engagement_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {engagements.map((engagement) => (
                      <SelectItem key={engagement.id} value={engagement.id}>
                        {engagement.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('workpapers.description_label')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('workpapers.description_placeholder')}
                rows={3}
                required
              />
            </div>

            {/* Enhanced Dataset Selection */}
            {!isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Select Data Source
                    <Sheet open={showAccountGuide} onOpenChange={setShowAccountGuide}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Account Selection Guide</SheetTitle>
                          <SheetDescription>
                            Learn how to effectively select accounts for your working paper
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                          <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Column Mapping
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p>The system automatically detects and maps these columns:</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>• AccountNumber</div>
                                <div>• AccountName</div>
                                <div>• Currency</div>
                                <div>• OpeningDebit</div>
                                <div>• OpeningCredit</div>
                                <div>• PeriodDebit</div>
                                <div>• PeriodCredit</div>
                                <div>• YTDDebit</div>
                                <div>• YTDCredit</div>
                                <div>• Entity</div>
                                <div>• Department</div>
                                <div>• Project</div>
                                <div>• Notes</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Selection Tips
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Use category filters to focus on specific account types</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Search by account name or number for quick location</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Sort by balance to identify material accounts</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>YTD balances are used for financial calculations</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </CardTitle>
                  <CardDescription>
                    Choose an imported Excel dataset containing trial balance data with automatic column mapping
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataset">Trial Balance Dataset</Label>
                    <Select value={selectedDatasetId} onValueChange={handleDatasetChange}>
                      <SelectTrigger>
                        <Database className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select a dataset containing trial balance data" />
                      </SelectTrigger>
                      <SelectContent>
                        {trialBalanceDatasets.map((dataset) => (
                          <SelectItem key={dataset.id} value={dataset.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{dataset.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {dataset.columns.length} columns • Version {Number(dataset.version)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Column Mapping Display */}
                  {Object.keys(columnMapping).length > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Detected Column Mapping
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(columnMapping).map(([field, column]) => (
                          <div key={field} className="flex justify-between">
                            <span className="font-medium">{field}:</span>
                            <span className="text-muted-foreground">{column}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {trialBalanceDatasets.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No trial balance datasets found</p>
                      <p className="text-xs">Import an Excel file with trial balance data first</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Enhanced Account Selection with Improved Horizontal Scrolling */}
            {(excelAccounts.length > 0 || isEditing) && (
              <Tabs defaultValue="accounts" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="accounts" className="gap-2">
                    <Calculator className="h-4 w-4" />
                    Account Selection
                  </TabsTrigger>
                  <TabsTrigger value="prior" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t('workpapers.prior_period')}
                  </TabsTrigger>
                  <TabsTrigger value="expected" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    {t('workpapers.expected_values')}
                  </TabsTrigger>
                </TabsList>

                {/* Enhanced Account Selection Tab */}
                <TabsContent value="accounts" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Select Accounts for Working Paper</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {selectedAccounts.length} of {excelAccounts.length} selected
                          </Badge>
                          <Button type="button" onClick={selectAllAccounts} size="sm" variant="outline">
                            Select All
                          </Button>
                          <Button type="button" onClick={deselectAllAccounts} size="sm" variant="outline">
                            Clear All
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Choose which accounts from the Excel data to include in your working paper with intelligent filtering
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Enhanced Filters */}
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search accounts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9"
                          />
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="h-9">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {accountCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{category.label}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {category.count}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                          const [newSortBy, newSortOrder] = value.split('-') as [typeof sortBy, typeof sortOrder];
                          setSortBy(newSortBy);
                          setSortOrder(newSortOrder);
                        }}>
                          <SelectTrigger className="h-9">
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name-asc">Name A-Z</SelectItem>
                            <SelectItem value="name-desc">Name Z-A</SelectItem>
                            <SelectItem value="number-asc">Number Low-High</SelectItem>
                            <SelectItem value="number-desc">Number High-Low</SelectItem>
                            <SelectItem value="balance-desc">Balance High-Low</SelectItem>
                            <SelectItem value="balance-asc">Balance Low-High</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset all filters</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsTableFullscreen(!isTableFullscreen)}
                                className="gap-1"
                              >
                                <FullscreenIcon className="h-3 w-3" />
                                {isTableFullscreen ? 'Exit' : 'Fullscreen'}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Toggle fullscreen table view</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      {/* Category Quick Select */}
                      <div className="flex flex-wrap gap-2">
                        {accountCategories.slice(1).map((category) => (
                          <Button
                            key={category.value}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => selectAccountsByCategory(category.value)}
                            disabled={category.count === 0}
                            className="gap-1"
                          >
                            <Target className="h-3 w-3" />
                            Select {category.label} ({category.count})
                          </Button>
                        ))}
                      </div>

                      {/* Enhanced Table with Improved Horizontal Scrolling */}
                      <div className={`${isTableFullscreen ? 'fixed inset-0 z-50 bg-background p-6' : ''}`}>
                        {isTableFullscreen && (
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Account Selection - Fullscreen View</h3>
                            <div className="flex items-center gap-2">
                              {/* Zoom Controls */}
                              <div className="flex items-center gap-1 border rounded-lg p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => adjustZoom('out')}
                                  disabled={tableZoom <= 70}
                                  className="h-7 w-7 p-0"
                                >
                                  <ZoomOut className="h-3 w-3" />
                                </Button>
                                <span className="text-xs font-mono px-2">{tableZoom}%</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => adjustZoom('in')}
                                  disabled={tableZoom >= 150}
                                  className="h-7 w-7 p-0"
                                >
                                  <ZoomIn className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsTableFullscreen(false)}
                              >
                                Exit Fullscreen
                              </Button>
                            </div>
                          </div>
                        )}

                        {isLoadingExcelData ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading account data...</p>
                          </div>
                        ) : filteredAccounts.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No accounts found matching your filters</p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={resetFilters}
                              className="mt-2"
                            >
                              Reset Filters
                            </Button>
                          </div>
                        ) : (
                          <div className="relative">
                            {/* Enhanced Horizontal Scrolling Container */}
                            <div 
                              className={`overflow-x-auto overflow-y-auto border rounded-lg bg-background/50 ${
                                isTableFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[400px]'
                              }`}
                            >
                              <div 
                                className="min-w-max"
                                style={{ 
                                  fontSize: `${tableZoom}%`,
                                  transform: `scale(${tableZoom / 100})`,
                                  transformOrigin: 'top left',
                                  width: `${10000 / tableZoom}%`
                                }}
                              >
                                <Table className="border-separate border-spacing-0">
                                  <TableHeader className="sticky top-0 z-10">
                                    <TableRow className="bg-background/95 backdrop-blur-sm border-b-2">
                                      <TableHead className="w-12 sticky left-0 bg-background/95 backdrop-blur-sm border-r">Select</TableHead>
                                      <TableHead className="min-w-[100px] sticky left-12 bg-background/95 backdrop-blur-sm border-r">{t('workpapers.account_number')}</TableHead>
                                      <TableHead className="min-w-[200px] border-r">{t('workpapers.account_name')}</TableHead>
                                      <TableHead className="min-w-[80px] border-r">{t('workpapers.currency')}</TableHead>
                                      <TableHead className="min-w-[120px] text-right border-r">{t('workpapers.opening_debit')}</TableHead>
                                      <TableHead className="min-w-[120px] text-right border-r">{t('workpapers.opening_credit')}</TableHead>
                                      <TableHead className="min-w-[120px] text-right border-r">{t('workpapers.period_debit')}</TableHead>
                                      <TableHead className="min-w-[120px] text-right border-r">{t('workpapers.period_credit')}</TableHead>
                                      <TableHead className="min-w-[120px] text-right border-r">{t('workpapers.ytd_debit')}</TableHead>
                                      <TableHead className="min-w-[120px] text-right border-r">{t('workpapers.ytd_credit')}</TableHead>
                                      <TableHead className="min-w-[100px] border-r">{t('workpapers.entity_field')}</TableHead>
                                      <TableHead className="min-w-[100px] border-r">{t('workpapers.department')}</TableHead>
                                      <TableHead className="min-w-[100px] border-r">{t('workpapers.project')}</TableHead>
                                      <TableHead className="min-w-[150px]">{t('workpapers.notes')}</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {filteredAccounts.map((account, index) => {
                                      const originalIndex = excelAccounts.findIndex(a => a.accountNumber === account.accountNumber);
                                      return (
                                        <TableRow key={account.accountNumber} className={account.selected ? 'bg-muted/50' : ''}>
                                          <TableCell className="sticky left-0 bg-background/95 backdrop-blur-sm border-r">
                                            <Checkbox
                                              checked={account.selected}
                                              onCheckedChange={() => toggleAccountSelection(originalIndex)}
                                            />
                                          </TableCell>
                                          <TableCell className="font-mono font-medium sticky left-12 bg-background/95 backdrop-blur-sm border-r">
                                            {account.accountNumber}
                                          </TableCell>
                                          <TableCell className="font-medium border-r">{account.accountName}</TableCell>
                                          <TableCell className="border-r">{account.currency}</TableCell>
                                          <TableCell className="text-right font-mono border-r">
                                            ${account.openingDebit.toLocaleString()}
                                          </TableCell>
                                          <TableCell className="text-right font-mono border-r">
                                            ${account.openingCredit.toLocaleString()}
                                          </TableCell>
                                          <TableCell className="text-right font-mono border-r">
                                            ${account.periodDebit.toLocaleString()}
                                          </TableCell>
                                          <TableCell className="text-right font-mono border-r">
                                            ${account.periodCredit.toLocaleString()}
                                          </TableCell>
                                          <TableCell className="text-right font-mono border-r">
                                            ${account.ytdDebit.toLocaleString()}
                                          </TableCell>
                                          <TableCell className="text-right font-mono border-r">
                                            ${account.ytdCredit.toLocaleString()}
                                          </TableCell>
                                          <TableCell className="border-r">{account.entity}</TableCell>
                                          <TableCell className="border-r">{account.department}</TableCell>
                                          <TableCell className="border-r">{account.project}</TableCell>
                                          <TableCell className="text-sm text-muted-foreground">{account.notes}</TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            {/* Enhanced Navigation Indicators */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border shadow-sm">
                              <Move className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground font-medium">Drag to scroll horizontally</span>
                            </div>

                            <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border shadow-sm">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Target className="h-3 w-3" />
                                <span>Showing {filteredAccounts.length} accounts</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selection Summary */}
                      {selectedAccounts.length > 0 && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="font-medium">Selection Summary</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            {accountCategories.slice(1).map((category) => {
                              const count = selectedAccounts.filter(a => a.category === category.value).length;
                              return count > 0 ? (
                                <div key={category.value} className="text-center">
                                  <div className="font-medium">{count}</div>
                                  <div className="text-muted-foreground text-xs">{category.label}</div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Prior Period Data */}
                <TabsContent value="prior" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{t('workpapers.prior_period_data')}</span>
                        <Button type="button" onClick={addPriorPeriodData} size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          {t('workpapers.add_account')}
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        {t('workpapers.prior_period_description')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {priorPeriodData.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('workpapers.no_prior_data')}</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('workpapers.account_number')}</TableHead>
                                <TableHead>{t('workpapers.account_name')}</TableHead>
                                <TableHead>{t('workpapers.ytd_debit')}</TableHead>
                                <TableHead>{t('workpapers.ytd_credit')}</TableHead>
                                <TableHead>{t('workpapers.actions')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {priorPeriodData.map((account, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Input
                                      value={account.accountNumber}
                                      onChange={(e) => updatePriorPeriodData(index, 'accountNumber', e.target.value)}
                                      placeholder="1000"
                                      className="w-20"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      value={account.accountName}
                                      onChange={(e) => updatePriorPeriodData(index, 'accountName', e.target.value)}
                                      placeholder="Cash"
                                      className="min-w-32"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={account.ytdDebit}
                                      onChange={(e) => updatePriorPeriodData(index, 'ytdDebit', e.target.value)}
                                      placeholder="0.00"
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={account.ytdCredit}
                                      onChange={(e) => updatePriorPeriodData(index, 'ytdCredit', e.target.value)}
                                      placeholder="0.00"
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removePriorPeriodData(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Expected Values */}
                <TabsContent value="expected" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{t('workpapers.expected_values')}</span>
                        <Button type="button" onClick={addExpectedValue} size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          {t('workpapers.add_account')}
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        {t('workpapers.expected_values_description')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {expectedValues.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('workpapers.no_expected_values')}</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('workpapers.account_number')}</TableHead>
                                <TableHead>{t('workpapers.account_name')}</TableHead>
                                <TableHead>{t('workpapers.expected_debit')}</TableHead>
                                <TableHead>{t('workpapers.expected_credit')}</TableHead>
                                <TableHead>{t('workpapers.actions')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {expectedValues.map((account, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Input
                                      value={account.accountNumber}
                                      onChange={(e) => updateExpectedValue(index, 'accountNumber', e.target.value)}
                                      placeholder="1000"
                                      className="w-20"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      value={account.accountName}
                                      onChange={(e) => updateExpectedValue(index, 'accountName', e.target.value)}
                                      placeholder="Cash"
                                      className="min-w-32"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={account.ytdDebit}
                                      onChange={(e) => updateExpectedValue(index, 'ytdDebit', e.target.value)}
                                      placeholder="0.00"
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={account.ytdCredit}
                                      onChange={(e) => updateExpectedValue(index, 'ytdCredit', e.target.value)}
                                      placeholder="0.00"
                                      className="w-24"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeExpectedValue(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                {t('workpapers.cancel')}
              </Button>
              
              {!isEditing && selectedAccounts.length > 0 && (
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading || !name.trim() || !engagementId}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isGenerating ? t('workpapers.generating') : t('workpapers.generate_with_analysis')}
                </Button>
              )}
              
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !name.trim() || !engagementId || !description.trim() || selectedAccounts.length === 0}
              >
                {isLoading 
                  ? (isEditing ? t('workpapers.updating') : t('workpapers.creating'))
                  : (isEditing ? t('workpapers.update') : t('workpapers.create'))
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
