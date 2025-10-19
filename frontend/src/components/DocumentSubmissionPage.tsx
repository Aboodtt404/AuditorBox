import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useFileUpload, useFileList } from '../blob-storage/FileStorage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Building2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentSubmission {
  id: string;
  fileName: string;
  fileType: string;
  company: string;
  category: string;
  description: string;
  uploadedAt: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  filePath: string;
}

const DOCUMENT_CATEGORIES = [
  { value: 'financial_statements', label: 'Financial Statements' },
  { value: 'trial_balance', label: 'Trial Balance' },
  { value: 'general_ledger', label: 'General Ledger' },
  { value: 'bank_statements', label: 'Bank Statements' },
  { value: 'invoices', label: 'Invoices & Receipts' },
  { value: 'contracts', label: 'Contracts & Agreements' },
  { value: 'tax_documents', label: 'Tax Documents' },
  { value: 'payroll', label: 'Payroll Records' },
  { value: 'inventory', label: 'Inventory Records' },
  { value: 'other', label: 'Other Documents' },
];

const COMPANIES = [
  { value: 'company_a', label: 'ABC Corporation' },
  { value: 'company_b', label: 'XYZ Industries' },
  { value: 'company_c', label: 'Global Tech Solutions' },
  { value: 'company_d', label: 'Regional Services Ltd' },
];

export default function DocumentSubmissionPage() {
  const { t } = useLanguage();
  const { uploadFile, isUploading } = useFileUpload();
  const { data: files } = useFileList();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Mock data for demonstration - in real app this would come from backend
  const [submissions, setSubmissions] = useState<DocumentSubmission[]>([
    {
      id: '1',
      fileName: 'Financial_Statement_Q4_2024.pdf',
      fileType: 'PDF',
      company: 'ABC Corporation',
      category: 'Financial Statements',
      description: 'Q4 2024 Financial Statements for audit review',
      uploadedAt: new Date('2024-12-15'),
      status: 'pending',
      filePath: 'documents/financial_statement_q4_2024.pdf'
    },
    {
      id: '2',
      fileName: 'Trial_Balance_December.xlsx',
      fileType: 'Excel',
      company: 'XYZ Industries',
      category: 'Trial Balance',
      description: 'December 2024 Trial Balance',
      uploadedAt: new Date('2024-12-10'),
      status: 'reviewed',
      filePath: 'documents/trial_balance_december.xlsx'
    }
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid file type (PDF, Excel, Word, or Image)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !company || !category || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Upload file to storage
      const filePath = `documents/${company}/${category}/${Date.now()}_${selectedFile.name}`;
      await uploadFile(filePath, selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      // Create submission record
      const newSubmission: DocumentSubmission = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        fileType: selectedFile.type.includes('pdf') ? 'PDF' : 
                  selectedFile.type.includes('sheet') || selectedFile.type.includes('excel') ? 'Excel' :
                  selectedFile.type.includes('word') ? 'Word' : 'Image',
        company: COMPANIES.find(c => c.value === company)?.label || company,
        category: DOCUMENT_CATEGORIES.find(c => c.value === category)?.label || category,
        description: description.trim(),
        uploadedAt: new Date(),
        status: 'pending',
        filePath
      };

      setSubmissions(prev => [newSubmission, ...prev]);

      // Reset form
      setSelectedFile(null);
      setCompany('');
      setCategory('');
      setDescription('');
      setUploadProgress(0);
      
      // Reset file input
      const fileInput = document.getElementById('document-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      toast.success('Document submitted successfully');
    } catch (error) {
      console.error('Error submitting document:', error);
      toast.error('Failed to submit document');
    }
  };

  const getStatusBadge = (status: DocumentSubmission['status']) => {
    const statusMap = {
      pending: { variant: 'secondary' as const, icon: Clock, label: 'Pending Review' },
      reviewed: { variant: 'default' as const, icon: AlertCircle, label: 'Under Review' },
      approved: { variant: 'secondary' as const, icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'destructive' as const, icon: AlertCircle, label: 'Rejected' },
    };
    
    const statusInfo = statusMap[status];
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
          <FileText className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Document Submission
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Upload accounting documents for audit review and processing
          </p>
        </div>
      </div>

      {/* Document Upload Form */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Upload className="h-6 w-6 text-primary" />
            Submit New Document
          </CardTitle>
          <CardDescription className="text-base">
            Upload accounting documents for your company. Supported formats: PDF, Excel, Word, and Images (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Company Selection */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-base font-medium">Company *</Label>
                <Select value={company} onValueChange={setCompany} required>
                  <SelectTrigger className="bg-background/50">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select your company" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANIES.map((comp) => (
                      <SelectItem key={comp.value} value={comp.value}>
                        {comp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Document Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">Document Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-background/50">
                    <FileText className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="document-upload" className="text-base font-medium">Document File *</Label>
              <Input
                id="document-upload"
                type="file"
                accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.gif"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all duration-200"
                required
              />
              {selectedFile && (
                <div className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a brief description of the document and its purpose"
                rows={3}
                className="bg-background/50"
                required
              />
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>Uploading document...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!selectedFile || !company || !category || !description.trim() || isUploading}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
            >
              <Upload className="h-5 w-5 mr-2" />
              {isUploading ? 'Uploading...' : 'Submit Document'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Submitted Documents */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            Submitted Documents
          </CardTitle>
          <CardDescription className="text-base">
            Track the status of your submitted documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No documents submitted yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Upload your first document using the form above
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold min-w-[200px]">Document Name</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Company</TableHead>
                    <TableHead className="font-semibold min-w-[150px]">Category</TableHead>
                    <TableHead className="font-semibold min-w-[80px]">Type</TableHead>
                    <TableHead className="font-semibold min-w-[180px]">Uploaded</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Status</TableHead>
                    <TableHead className="font-semibold min-w-[200px]">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-muted/50 transition-colors duration-150">
                      <TableCell className="font-medium">{submission.fileName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Building2 className="h-3 w-3" />
                          {submission.company}
                        </Badge>
                      </TableCell>
                      <TableCell>{submission.category}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{submission.fileType}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(submission.uploadedAt)}
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={submission.description}>
                          {submission.description}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
