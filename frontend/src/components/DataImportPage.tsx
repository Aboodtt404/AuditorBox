import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from './LanguageProvider';
import { useGetAllImportedDatasets, useSaveImportedDataset } from '../hooks/useQueries';
import { useFileUpload } from '../blob-storage/FileStorage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileSpreadsheet, 
  Eye, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  ArrowLeft, 
  ArrowRight,
  HelpCircle,
  Layers,
  Grid3X3,
  Search,
  Filter,
  RotateCcw,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  Zap,
  Target,
  Move,
  ZoomIn,
  ZoomOut,
  FullscreenIcon,
  CloudUpload,
  File
} from 'lucide-react';
import { toast } from 'sonner';
import { ColumnMetadata } from '../backend';

interface ParsedData {
  sheets: string[];
  selectedSheet: string;
  data: any[][];
  columns: ColumnMetadata[];
  previewData: any[][];
  sheetData: Record<string, any[][]>;
}

interface DataTypeInfo {
  type: string;
  icon: string;
  color: string;
  description: string;
}

const DATA_TYPES: Record<string, DataTypeInfo> = {
  text: { 
    type: 'Text', 
    icon: '📝', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    description: 'Text and string values'
  },
  numeric: { 
    type: 'Numeric', 
    icon: '🔢', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    description: 'Numbers and calculations'
  },
  date: { 
    type: 'Date', 
    icon: '📅', 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    description: 'Date and time values'
  },
  boolean: { 
    type: 'Boolean', 
    icon: '✓', 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    description: 'True/false values'
  },
  currency: { 
    type: 'Currency', 
    icon: '💰', 
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    description: 'Monetary values'
  },
};

const PII_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s]{2,50}$/,
  nationalId: /^\d{10,15}$/,
};

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

export default function DataImportPage() {
  const { t } = useLanguage();
  const { data: datasets = [], isLoading: datasetsLoading } = useGetAllImportedDatasets();
  const { uploadFile, isUploading } = useFileUpload();
  const saveDataset = useSaveImportedDataset();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [showDataStructureHelp, setShowDataStructureHelp] = useState(false);
  const [columnSearchTerm, setColumnSearchTerm] = useState('');
  const [selectedDataType, setSelectedDataType] = useState<string>('all');
  const [showPIIOnly, setShowPIIOnly] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tableZoom, setTableZoom] = useState(100);
  const [isDragOver, setIsDragOver] = useState(false);

  const detectDataType = (values: any[]): string => {
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    if (nonNullValues.length === 0) return 'text';

    let numericCount = 0;
    let dateCount = 0;
    let booleanCount = 0;
    let currencyCount = 0;

    for (const value of nonNullValues.slice(0, 100)) {
      const str = String(value).trim();
      
      if (/^\$?\d+\.?\d*$/.test(str) || /^\d+\.?\d*\s?(USD|EUR|GBP)$/i.test(str)) {
        currencyCount++;
      }
      else if (!isNaN(Number(str)) && str !== '') {
        numericCount++;
      }
      else if (!isNaN(Date.parse(str))) {
        dateCount++;
      }
      else if (/^(true|false|yes|no|1|0)$/i.test(str)) {
        booleanCount++;
      }
    }

    const total = nonNullValues.length;
    if (currencyCount / total > 0.7) return 'currency';
    if (numericCount / total > 0.7) return 'numeric';
    if (dateCount / total > 0.7) return 'date';
    if (booleanCount / total > 0.7) return 'boolean';
    
    return 'text';
  };

  const detectPII = (values: any[], columnName: string): boolean => {
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '').slice(0, 50);
    if (nonNullValues.length === 0) return false;

    const nameIndicators = ['name', 'email', 'phone', 'id', 'ssn', 'social'];
    if (nameIndicators.some(indicator => columnName.toLowerCase().includes(indicator))) {
      return true;
    }

    let piiCount = 0;
    for (const value of nonNullValues) {
      const str = String(value).trim();
      if (Object.values(PII_PATTERNS).some(pattern => pattern.test(str))) {
        piiCount++;
      }
    }

    return piiCount / nonNullValues.length > 0.3;
  };

  const analyzeColumn = (data: any[][], columnIndex: number, columnName: string): ColumnMetadata => {
    const values = data.slice(1).map(row => row[columnIndex]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    
    const dataType = detectDataType(values);
    const isPII = detectPII(values, columnName);
    const nullPercent = ((values.length - nonNullValues.length) / values.length) * 100;
    const uniqueValues = [...new Set(nonNullValues)];
    const uniqueCount = uniqueValues.length;
    
    let minValue: string | undefined;
    let maxValue: string | undefined;
    
    if (dataType === 'numeric' || dataType === 'currency') {
      const numericValues = nonNullValues.map(v => Number(v)).filter(v => !isNaN(v));
      if (numericValues.length > 0) {
        minValue = Math.min(...numericValues).toString();
        maxValue = Math.max(...numericValues).toString();
      }
    } else if (dataType === 'date') {
      const dateValues = nonNullValues.map(v => new Date(v)).filter(d => !isNaN(d.getTime()));
      if (dateValues.length > 0) {
        minValue = new Date(Math.min(...dateValues.map(d => d.getTime()))).toISOString().split('T')[0];
        maxValue = new Date(Math.max(...dateValues.map(d => d.getTime()))).toISOString().split('T')[0];
      }
    }

    const sampleValues = uniqueValues.slice(0, 5).map(v => String(v));

    return {
      name: columnName,
      dataType,
      isPII,
      nullPercent,
      uniqueCount: BigInt(uniqueCount),
      minValue,
      maxValue,
      sampleValues,
    };
  };

  const parseCSVData = (csvText: string): any[][] => {
    const lines = csvText.split('\n');
    const result: any[][] = [];
    
    for (const line of lines) {
      if (line.trim()) {
        const row = line.split(',').map(cell => {
          let value = cell.trim();
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          return value === '' ? null : value;
        });
        result.push(row);
      }
    }
    
    return result;
  };

  const parseExcelData = async (file: File): Promise<{ sheets: string[], data: Record<string, any[][]> }> => {
    const XLSX = await loadSheetJS();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets: string[] = workbook.SheetNames;
          const sheetData: Record<string, any[][]> = {};
          
          sheets.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
              header: 1, 
              defval: null,
              raw: false
            });
            sheetData[sheetName] = jsonData as any[][];
          });
          
          resolve({ sheets, data: sheetData });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const processSheetData = (sheetData: any[][], sheetName: string, allSheetData: Record<string, any[][]>) => {
    if (sheetData.length === 0) {
      toast.error('The selected sheet is empty');
      return;
    }

    const headers = sheetData[0] || [];
    const columns = headers.map((header, index) => 
      analyzeColumn(sheetData, index, String(header || `Column ${index + 1}`))
    );

    setParsedData({
      sheets: availableSheets,
      selectedSheet: sheetName,
      data: sheetData,
      columns,
      previewData: sheetData.slice(0, 51),
      sheetData: allSheetData,
    });

    toast.success(`Sheet "${sheetName}" processed successfully`);
  };

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
    if (!['xlsx', 'xls', 'csv', 'txt'].includes(fileExtension || '')) {
      toast.error('Please select a valid Excel file (.xlsx, .xls) or CSV file (.csv, .txt)');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      if (fileExtension === 'csv' || fileExtension === 'txt') {
        const text = await selectedFile.text();
        const data = parseCSVData(text);
        
        if (data.length === 0) {
          toast.error('The selected file is empty');
          return;
        }

        const sheets = ['Sheet1'];
        setAvailableSheets(sheets);
        setSelectedSheet('Sheet1');
        setCurrentSheetIndex(0);
        const allSheetData = { 'Sheet1': data };
        processSheetData(data, 'Sheet1', allSheetData);
      } else {
        const { sheets, data } = await parseExcelData(selectedFile);
        
        if (sheets.length === 0) {
          toast.error('No sheets found in the Excel file');
          return;
        }

        setAvailableSheets(sheets);
        const firstSheet = sheets[0];
        setSelectedSheet(firstSheet);
        setCurrentSheetIndex(0);
        
        processSheetData(data[firstSheet], firstSheet, data);
      }

      setDatasetName(selectedFile.name.replace(/\.(csv|txt|xlsx|xls)$/i, ''));
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Failed to parse file. Please ensure it\'s a valid Excel or CSV file.');
    } finally {
      setIsProcessing(false);
    }
  }, [availableSheets]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => {
      const extension = file.name.toLowerCase().split('.').pop();
      return ['xlsx', 'xls', 'csv', 'txt'].includes(extension || '');
    });
    
    if (excelFile) {
      handleFileSelect(excelFile);
    } else {
      toast.error('Please drop a valid Excel file (.xlsx, .xls) or CSV file (.csv, .txt)');
    }
  };

  const handleSheetChange = (sheetName: string) => {
    if (!parsedData?.sheetData || !parsedData.sheetData[sheetName]) {
      toast.error('Sheet data not available');
      return;
    }

    const sheetIndex = availableSheets.indexOf(sheetName);
    setCurrentSheetIndex(sheetIndex);
    setSelectedSheet(sheetName);
    processSheetData(parsedData.sheetData[sheetName], sheetName, parsedData.sheetData);
  };

  const navigateSheet = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentSheetIndex - 1)
      : Math.min(availableSheets.length - 1, currentSheetIndex + 1);
    
    if (newIndex !== currentSheetIndex) {
      const newSheet = availableSheets[newIndex];
      handleSheetChange(newSheet);
    }
  };

  const handleColumnTypeChange = (columnIndex: number, newType: string) => {
    if (!parsedData) return;

    const updatedColumns = [...parsedData.columns];
    updatedColumns[columnIndex] = {
      ...updatedColumns[columnIndex],
      dataType: newType,
    };

    setParsedData({
      ...parsedData,
      columns: updatedColumns,
    });
  };

  const handleColumnNameChange = (columnIndex: number, newName: string) => {
    if (!parsedData) return;

    const updatedColumns = [...parsedData.columns];
    updatedColumns[columnIndex] = {
      ...updatedColumns[columnIndex],
      name: newName,
    };

    setParsedData({
      ...parsedData,
      columns: updatedColumns,
    });
  };

  const handleSaveDataset = async () => {
    if (!parsedData || !file || !datasetName.trim()) {
      toast.error('Please provide a dataset name');
      return;
    }

    try {
      const filePath = `datasets/${Date.now()}_${file.name}`;
      await uploadFile(filePath, file, (progress) => {
        setUploadProgress(progress);
      });

      const datasetId = `dataset_${Date.now()}`;
      await saveDataset.mutateAsync({
        id: datasetId,
        name: datasetName.trim(),
        columns: parsedData.columns,
      });

      setFile(null);
      setParsedData(null);
      setDatasetName('');
      setUploadProgress(0);
      setAvailableSheets([]);
      setSelectedSheet('');
      setCurrentSheetIndex(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error saving dataset:', error);
      toast.error('Failed to save dataset');
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredColumns = parsedData?.columns.filter(column => {
    const matchesSearch = column.name.toLowerCase().includes(columnSearchTerm.toLowerCase());
    const matchesType = selectedDataType === 'all' || column.dataType === selectedDataType;
    const matchesPII = !showPIIOnly || column.isPII;
    return matchesSearch && matchesType && matchesPII;
  }) || [];

  const resetFilters = () => {
    setColumnSearchTerm('');
    setSelectedDataType('all');
    setShowPIIOnly(false);
  };

  const adjustZoom = (direction: 'in' | 'out') => {
    setTableZoom(prev => {
      const newZoom = direction === 'in' ? Math.min(prev + 10, 150) : Math.max(prev - 10, 70);
      return newZoom;
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-8 animate-in fade-in-50 duration-500">
        {/* Enhanced Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Upload className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('data_import.title')}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {t('data_import.subtitle')}
            </p>
          </div>
          <Sheet open={showDataStructureHelp} onOpenChange={setShowDataStructureHelp}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Data Guide
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Data Import Guide</SheetTitle>
                <SheetDescription>
                  Learn how to effectively import and analyze your Excel data
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Supported File Types
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Excel files (.xlsx, .xls)
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      CSV files (.csv, .txt)
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-3 w-3 text-blue-500" />
                      Maximum file size: 10MB
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Sheet Navigation
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• Use the sheet selector to switch between worksheets</p>
                    <p>• Navigate with arrow buttons for quick switching</p>
                    <p>• Each sheet is analyzed independently</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Data Types
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(DATA_TYPES).map(([key, info]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span className="text-base">{info.icon}</span>
                        <span className="font-medium">{info.type}:</span>
                        <span className="text-muted-foreground">{info.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    PII Detection
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• Automatically detects personal information</p>
                    <p>• Flags emails, phone numbers, IDs</p>
                    <p>• Use filters to focus on sensitive data</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Enhanced File Upload Section */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              {t('data_import.upload_file')}
            </CardTitle>
            <CardDescription className="text-base">
              Upload Excel files (.xlsx, .xls) or CSV files (.csv, .txt) for intelligent data analysis and import.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enhanced Info Banner */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800 dark:text-green-200">
                <p className="font-medium mb-1">Intelligent Data Processing</p>
                <p>Advanced Excel support with automatic data type detection, PII identification, and multi-sheet navigation. Get insights into your data structure instantly.</p>
              </div>
            </div>

            {/* Enhanced Upload Area with Drag & Drop */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                isDragOver 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/20'
              } ${isProcessing || isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleButtonClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isProcessing || isUploading}
                className="hidden"
                id="file-upload"
              />
              
              <div className="flex flex-col items-center gap-4 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isDragOver 
                    ? 'bg-primary text-primary-foreground scale-110' 
                    : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                }`}>
                  {isDragOver ? (
                    <CloudUpload className="h-8 w-8" />
                  ) : (
                    <Upload className="h-8 w-8" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {isDragOver ? 'Drop your file here' : 'Upload Excel or CSV File'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isDragOver 
                      ? 'Release to upload your file' 
                      : 'Click to browse or drag and drop your file here'
                    }
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <File className="h-4 w-4" />
                    <span>.xlsx, .xls</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>.csv, .txt</span>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant={isDragOver ? "default" : "outline"}
                  size="lg"
                  disabled={isProcessing || isUploading}
                  className="mt-2 gap-2 transition-all duration-200 hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick();
                  }}
                >
                  <Upload className="h-4 w-4" />
                  {t('data_import.select_file')}
                </Button>
              </div>
              
              {file && (
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border shadow-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span className="font-medium">{t('data_import.processing')}</span>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>{t('data_import.uploading')}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Sheet Navigation */}
        {availableSheets.length > 1 && (
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Sheet Navigation
              </CardTitle>
              <CardDescription>
                Navigate between {availableSheets.length} worksheets in your Excel file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateSheet('prev')}
                        disabled={currentSheetIndex === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous sheet</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateSheet('next')}
                        disabled={currentSheetIndex === availableSheets.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next sheet</TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex-1">
                  <Select value={selectedSheet} onValueChange={handleSheetChange}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select a sheet" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSheets.map((sheet, index) => (
                        <SelectItem key={sheet} value={sheet}>
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            <span>{sheet}</span>
                            <Badge variant="outline" className="text-xs">
                              {index + 1} of {availableSheets.length}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Badge variant="secondary" className="gap-1">
                  <Layers className="h-3 w-3" />
                  Sheet {currentSheetIndex + 1} of {availableSheets.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Data Analysis with Improved Horizontal Scrolling */}
        {parsedData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
              <ResizablePanelGroup 
                direction="horizontal" 
                className={`${isFullscreen ? 'h-screen' : 'min-h-[700px]'} rounded-lg border`}
              >
                {/* Left Panel - Enhanced Schema Analysis */}
                <ResizablePanel defaultSize={35} minSize={30}>
                  <Card className="h-full border-0 rounded-none bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Database className="h-5 w-5 text-primary" />
                        Schema Analysis
                      </CardTitle>
                      <CardDescription>
                        {parsedData.columns.length} columns detected
                        {availableSheets.length > 1 && (
                          <span className="block mt-1 text-xs">
                            Sheet: <Badge variant="outline" className="text-xs">{selectedSheet}</Badge>
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Enhanced Filters */}
                      <div className="px-6 pb-4 space-y-4 border-b">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search columns..."
                            value={columnSearchTerm}
                            onChange={(e) => setColumnSearchTerm(e.target.value)}
                            className="h-8 text-sm bg-background/50"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                          <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                            <SelectTrigger className="h-8 bg-background/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              {Object.entries(DATA_TYPES).map(([key, info]) => (
                                <SelectItem key={key} value={key}>
                                  <span className="flex items-center gap-2">
                                    <span>{info.icon}</span>
                                    {info.type}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant={showPIIOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowPIIOnly(!showPIIOnly)}
                            className="gap-1"
                          >
                            <AlertCircle className="h-3 w-3" />
                            PII
                          </Button>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset filters</TooltipContent>
                          </Tooltip>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Showing {filteredColumns.length} of {parsedData.columns.length} columns
                        </div>
                      </div>

                      <ScrollArea className="h-[500px] px-6">
                        <div className="space-y-4 pb-6">
                          {filteredColumns.map((column, index) => {
                            const originalIndex = parsedData.columns.findIndex(c => c.name === column.name);
                            const dataTypeInfo = DATA_TYPES[column.dataType] || DATA_TYPES.text;
                            
                            return (
                              <div key={index} className="space-y-3 p-4 border border-border/50 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground">Column Name</Label>
                                  <Input
                                    value={column.name}
                                    onChange={(e) => handleColumnNameChange(originalIndex, e.target.value)}
                                    className="h-8 text-sm bg-background/50"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-muted-foreground">Data Type</Label>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Select
                                        value={column.dataType}
                                        onValueChange={(value) => handleColumnTypeChange(originalIndex, value)}
                                      >
                                        <SelectTrigger className="h-8 bg-background/50">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Object.entries(DATA_TYPES).map(([key, info]) => (
                                            <SelectItem key={key} value={key}>
                                              <span className="flex items-center gap-2">
                                                <span>{info.icon}</span>
                                                {info.type}
                                              </span>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TooltipTrigger>
                                    <TooltipContent>{dataTypeInfo.description}</TooltipContent>
                                  </Tooltip>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-xs">
                                        Unique: {Number(column.uniqueCount)}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>Number of unique values</TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-xs">
                                        Null: {column.nullPercent.toFixed(1)}%
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>Percentage of empty values</TooltipContent>
                                  </Tooltip>
                                  
                                  {column.isPII && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge variant="destructive" className="text-xs">
                                          <AlertCircle className="h-3 w-3 mr-1" />
                                          PII
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>Contains personally identifiable information</TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>

                                {(column.minValue || column.maxValue) && (
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    {column.minValue && <div>Min: {column.minValue}</div>}
                                    {column.maxValue && <div>Max: {column.maxValue}</div>}
                                  </div>
                                )}

                                {column.sampleValues.length > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    <div className="font-medium mb-1">Sample Values:</div>
                                    <div className="space-y-1">
                                      {column.sampleValues.slice(0, 3).map((sample, i) => (
                                        <div key={i} className="truncate bg-background/50 px-2 py-1 rounded">"{sample}"</div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Enhanced Data Preview with Smooth Horizontal Scrolling */}
                <ResizablePanel defaultSize={65} minSize={50}>
                  <Card className="h-full border-0 rounded-none bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Grid3X3 className="h-6 w-6 text-primary" />
                          Data Preview
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Zoom Controls */}
                          <div className="flex items-center gap-1 border rounded-lg p-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => adjustZoom('out')}
                                  disabled={tableZoom <= 70}
                                  className="h-7 w-7 p-0"
                                >
                                  <ZoomOut className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Zoom out</TooltipContent>
                            </Tooltip>
                            
                            <span className="text-xs font-mono px-2">{tableZoom}%</span>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => adjustZoom('in')}
                                  disabled={tableZoom >= 150}
                                  className="h-7 w-7 p-0"
                                >
                                  <ZoomIn className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Zoom in</TooltipContent>
                            </Tooltip>
                          </div>
                          
                          {/* Fullscreen Toggle */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="gap-1"
                              >
                                <FullscreenIcon className="h-3 w-3" />
                                {isFullscreen ? 'Exit' : 'Fullscreen'}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Toggle fullscreen view</TooltipContent>
                          </Tooltip>
                        </div>
                      </CardTitle>
                      <CardDescription className="text-base">
                        First 50 rows with intelligent column analysis
                        {availableSheets.length > 1 && (
                          <span className="block mt-1">
                            Currently viewing: <Badge variant="secondary" className="text-xs">{selectedSheet}</Badge>
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Enhanced Horizontal Scrolling Container */}
                        <div className="overflow-x-auto overflow-y-auto h-[500px] border rounded-lg bg-background/50">
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
                              <TableHeader className="sticky top-0 z-20">
                                <TableRow className="bg-background/95 backdrop-blur-sm border-b-2">
                                  {parsedData.columns.map((column, index) => {
                                    const dataTypeInfo = DATA_TYPES[column.dataType] || DATA_TYPES.text;
                                    
                                    return (
                                      <TableHead 
                                        key={index} 
                                        className="min-w-[180px] max-w-[300px] p-3 border-r border-border/50 last:border-r-0 bg-background/95 backdrop-blur-sm sticky top-0"
                                        style={{ position: 'sticky', top: 0, zIndex: 10 }}
                                      >
                                        <div className="space-y-2">
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <div className="font-semibold text-sm truncate cursor-help" title={column.name}>
                                                {column.name}
                                              </div>
                                            </TooltipTrigger>
                                            <TooltipContent>{column.name}</TooltipContent>
                                          </Tooltip>
                                          
                                          <div className="flex flex-col gap-1">
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Badge 
                                                  variant="outline" 
                                                  className={`text-xs w-fit cursor-help ${dataTypeInfo.color}`}
                                                >
                                                  {dataTypeInfo.icon} {dataTypeInfo.type}
                                                </Badge>
                                              </TooltipTrigger>
                                              <TooltipContent>{dataTypeInfo.description}</TooltipContent>
                                            </Tooltip>
                                            
                                            <div className="flex gap-1 flex-wrap">
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Badge variant="secondary" className="text-xs cursor-help">
                                                    {Number(column.uniqueCount)} unique
                                                  </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>Unique values in this column</TooltipContent>
                                              </Tooltip>
                                              
                                              {column.isPII && (
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Badge variant="destructive" className="text-xs cursor-help">
                                                      PII
                                                    </Badge>
                                                  </TooltipTrigger>
                                                  <TooltipContent>Contains personally identifiable information</TooltipContent>
                                                </Tooltip>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </TableHead>
                                    );
                                  })}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {parsedData.previewData.slice(1, 51).map((row, rowIndex) => (
                                  <TableRow 
                                    key={rowIndex} 
                                    className="hover:bg-muted/50 transition-colors duration-150"
                                  >
                                    {row.map((cell, cellIndex) => (
                                      <TableCell 
                                        key={cellIndex} 
                                        className="min-w-[180px] max-w-[300px] p-3 border-r border-border/20 last:border-r-0"
                                      >
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="truncate cursor-help" title={String(cell || '')}>
                                              {cell === null || cell === undefined || cell === '' ? (
                                                <span className="text-muted-foreground italic text-sm">null</span>
                                              ) : (
                                                <span className="text-sm">{String(cell)}</span>
                                              )}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>{String(cell || 'null')}</TooltipContent>
                                        </Tooltip>
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        
                        {/* Enhanced Navigation Indicators */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border shadow-sm">
                          <Move className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">Drag to scroll • Use mouse wheel</span>
                        </div>

                        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border shadow-sm">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Target className="h-3 w-3" />
                            <span>Showing 50 of {parsedData.data.length - 1} rows • {parsedData.columns.length} columns</span>
                          </div>
                        </div>

                        {/* Horizontal Scroll Indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/20 rounded-b-lg">
                          <div className="h-full bg-primary/30 rounded-b-lg transition-all duration-200" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>

              {/* Fullscreen Exit Button */}
              {isFullscreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 z-30 gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Exit Fullscreen
                </Button>
              )}
            </div>

            {/* Enhanced Save Section */}
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5 text-primary" />
                  Save Dataset
                </CardTitle>
                <CardDescription>
                  Save your analyzed dataset for use in working papers and audit analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataset-name" className="text-base font-medium">Dataset Name</Label>
                  <Input
                    id="dataset-name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="Enter a descriptive name for this dataset"
                    className="bg-background/50"
                  />
                </div>
                
                <Button
                  onClick={handleSaveDataset}
                  disabled={!datasetName.trim() || saveDataset.isPending || isUploading}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {saveDataset.isPending ? 'Saving Dataset...' : 'Save Dataset'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <Separator className="my-8" />

        {/* Enhanced Existing Datasets */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              Imported Datasets
            </CardTitle>
            <CardDescription className="text-base">
              Previously imported and analyzed datasets ready for working paper generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {datasetsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : datasets.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">No datasets imported yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Import your first Excel file to get started with data analysis
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold min-w-[200px]">Dataset Name</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">Version</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Columns</TableHead>
                      <TableHead className="font-semibold min-w-[180px]">Created</TableHead>
                      <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {datasets.map((dataset) => (
                      <TableRow key={dataset.id} className="hover:bg-muted/50 transition-colors duration-150">
                        <TableCell className="font-medium">{dataset.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">v{Number(dataset.version)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{dataset.columns.length} columns</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatTimestamp(dataset.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle className="h-3 w-3" />
                            Ready
                          </Badge>
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
    </TooltipProvider>
  );
}
