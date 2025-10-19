import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Building2, 
  Building,
  Move,
  ZoomIn,
  ZoomOut,
  FullscreenIcon,
  Target
} from 'lucide-react';
import { WorkingPaper } from '../backend';

interface WorkingPaperViewModalProps {
  workingPaper: WorkingPaper;
  onClose: () => void;
}

export default function WorkingPaperViewModal({ workingPaper, onClose }: WorkingPaperViewModalProps) {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tableZoom, setTableZoom] = useState(100);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const adjustZoom = (direction: 'in' | 'out') => {
    setTableZoom(prev => {
      const newZoom = direction === 'in' ? Math.min(prev + 10, 150) : Math.max(prev - 10, 70);
      return newZoom;
    });
  };

  const EnhancedTable = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6' : ''}`}>
      {isFullscreen && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title} - Fullscreen View</h3>
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
              onClick={() => setIsFullscreen(false)}
            >
              Exit Fullscreen
            </Button>
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* Enhanced Horizontal Scrolling Container */}
        <div 
          className={`overflow-x-auto overflow-y-auto border rounded-lg bg-background/50 ${
            isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[400px]'
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
            {children}
          </div>
        </div>
        
        {/* Enhanced Navigation Indicators */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border shadow-sm">
          <Move className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Drag to scroll • Use mouse wheel</span>
        </div>

        {/* Fullscreen Toggle */}
        {!isFullscreen && (
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 border shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(true)}
                  className="h-7 w-7 p-0"
                >
                  <FullscreenIcon className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen view</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {workingPaper.name}
            </DialogTitle>
            <DialogDescription>
              {workingPaper.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Working Paper Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('workpapers.paper_info')}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t('workpapers.engagement_id')}</Label>
                  <p className="text-sm">{workingPaper.engagementId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t('workpapers.created_at')}</Label>
                  <p className="text-sm">{formatDate(workingPaper.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t('workpapers.updated_at')}</Label>
                  <p className="text-sm">{formatDate(workingPaper.updatedAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t('workpapers.supporting_docs')}</Label>
                  <p className="text-sm">{workingPaper.supportingDocuments.length} documents</p>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Tabbed Analysis with Improved Horizontal Scrolling */}
            <Tabs defaultValue="balances" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="balances" className="gap-2">
                  <Calculator className="h-4 w-4" />
                  {t('workpapers.account_balances')}
                </TabsTrigger>
                <TabsTrigger value="ratios" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('workpapers.financial_ratios')}
                </TabsTrigger>
                <TabsTrigger value="trends" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t('workpapers.trend_analysis')}
                </TabsTrigger>
                <TabsTrigger value="variance" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('workpapers.variance_analysis')}
                </TabsTrigger>
              </TabsList>

              {/* Account Balances with Enhanced Scrolling */}
              <TabsContent value="balances" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t('workpapers.leadsheet')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {workingPaper.accountBalances.length} accounts
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsFullscreen(true)}
                              className="gap-1"
                            >
                              <FullscreenIcon className="h-3 w-3" />
                              Fullscreen
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View in fullscreen for better navigation</TooltipContent>
                        </Tooltip>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {t('workpapers.leadsheet_description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {workingPaper.accountBalances.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{t('workpapers.no_account_balances')}</p>
                      </div>
                    ) : (
                      <EnhancedTable title="Account Balances">
                        <Table className="border-separate border-spacing-0">
                          <TableHeader className="sticky top-0 z-10">
                            <TableRow className="bg-background/95 backdrop-blur-sm border-b-2">
                              <TableHead className="min-w-[100px] sticky left-0 bg-background/95 backdrop-blur-sm border-r">
                                {t('workpapers.account_number')}
                              </TableHead>
                              <TableHead className="min-w-[200px] sticky left-[100px] bg-background/95 backdrop-blur-sm border-r">
                                {t('workpapers.account_name')}
                              </TableHead>
                              <TableHead className="min-w-[80px] border-r">
                                {t('workpapers.currency')}
                              </TableHead>
                              <TableHead className="min-w-[120px] text-right border-r">
                                {t('workpapers.opening_debit')}
                              </TableHead>
                              <TableHead className="min-w-[120px] text-right border-r">
                                {t('workpapers.opening_credit')}
                              </TableHead>
                              <TableHead className="min-w-[120px] text-right border-r">
                                {t('workpapers.period_debit')}
                              </TableHead>
                              <TableHead className="min-w-[120px] text-right border-r">
                                {t('workpapers.period_credit')}
                              </TableHead>
                              <TableHead className="min-w-[120px] text-right border-r">
                                {t('workpapers.ytd_debit')}
                              </TableHead>
                              <TableHead className="min-w-[120px] text-right border-r">
                                {t('workpapers.ytd_credit')}
                              </TableHead>
                              <TableHead className="min-w-[100px] border-r">
                                {t('workpapers.entity_field')}
                              </TableHead>
                              <TableHead className="min-w-[100px] border-r">
                                {t('workpapers.department')}
                              </TableHead>
                              <TableHead className="min-w-[100px] border-r">
                                {t('workpapers.project')}
                              </TableHead>
                              <TableHead className="min-w-[150px]">
                                {t('workpapers.notes')}
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workingPaper.accountBalances.map((account, index) => (
                              <TableRow key={index} className="hover:bg-muted/50 transition-colors duration-150">
                                <TableCell className="font-mono sticky left-0 bg-background/95 backdrop-blur-sm border-r">
                                  {account.accountNumber}
                                </TableCell>
                                <TableCell className="font-medium sticky left-[100px] bg-background/95 backdrop-blur-sm border-r">
                                  {account.accountName}
                                </TableCell>
                                <TableCell className="border-r">
                                  {account.currency}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(account.openingDebit)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(account.openingCredit)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(account.periodDebit)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(account.periodCredit)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(account.ytdDebit)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(account.ytdCredit)}
                                </TableCell>
                                <TableCell className="border-r">
                                  {account.entity}
                                </TableCell>
                                <TableCell className="border-r">
                                  {account.department}
                                </TableCell>
                                <TableCell className="border-r">
                                  {account.project}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {account.notes}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </EnhancedTable>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Financial Ratios */}
              <TabsContent value="ratios" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('workpapers.calculated_ratios')}</CardTitle>
                    <CardDescription>
                      {t('workpapers.ratios_description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {workingPaper.financialRatios.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{t('workpapers.no_ratios')}</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {workingPaper.financialRatios.map((ratio, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">{ratio.name}</CardTitle>
                              <CardDescription className="text-sm">{ratio.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold text-primary">
                                {ratio.value.toFixed(2)}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trend Analysis with Enhanced Scrolling */}
              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t('workpapers.trend_comparison')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {workingPaper.trendAnalysis.length} trends
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsFullscreen(true)}
                              className="gap-1"
                            >
                              <FullscreenIcon className="h-3 w-3" />
                              Fullscreen
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View in fullscreen for better navigation</TooltipContent>
                        </Tooltip>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {t('workpapers.trend_description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {workingPaper.trendAnalysis.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{t('workpapers.no_trend_analysis')}</p>
                      </div>
                    ) : (
                      <EnhancedTable title="Trend Analysis">
                        <Table className="border-separate border-spacing-0">
                          <TableHeader className="sticky top-0 z-10">
                            <TableRow className="bg-background/95 backdrop-blur-sm border-b-2">
                              <TableHead className="min-w-[120px] sticky left-0 bg-background/95 backdrop-blur-sm border-r">
                                {t('workpapers.account_number')}
                              </TableHead>
                              <TableHead className="min-w-[200px] sticky left-[120px] bg-background/95 backdrop-blur-sm border-r">
                                {t('workpapers.account_name')}
                              </TableHead>
                              <TableHead className="min-w-[140px] text-right border-r">
                                {t('workpapers.current_period')}
                              </TableHead>
                              <TableHead className="min-w-[140px] text-right border-r">
                                {t('workpapers.prior_period')}
                              </TableHead>
                              <TableHead className="min-w-[120px] text-right border-r">
                                {t('workpapers.variance')}
                              </TableHead>
                              <TableHead className="min-w-[140px] text-right">
                                {t('workpapers.percentage_change')}
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workingPaper.trendAnalysis.map((trend, index) => (
                              <TableRow key={index} className="hover:bg-muted/50 transition-colors duration-150">
                                <TableCell className="font-mono sticky left-0 bg-background/95 backdrop-blur-sm border-r">
                                  {trend.accountNumber}
                                </TableCell>
                                <TableCell className="font-medium sticky left-[120px] bg-background/95 backdrop-blur-sm border-r">
                                  {trend.accountName}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(trend.currentPeriod)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(trend.priorPeriod)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  <Badge variant={trend.variance >= 0 ? "secondary" : "destructive"}>
                                    {formatCurrency(trend.variance)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  <Badge variant={trend.percentageChange >= 0 ? "secondary" : "destructive"}>
                                    {formatPercentage(trend.percentageChange)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </EnhancedTable>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Variance Analysis with Enhanced Scrolling */}
              <TabsContent value="variance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t('workpapers.variance_comparison')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {workingPaper.varianceAnalysis.length} variances
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsFullscreen(true)}
                              className="gap-1"
                            >
                              <FullscreenIcon className="h-3 w-3" />
                              Fullscreen
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View in fullscreen for better navigation</TooltipContent>
                        </Tooltip>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {t('workpapers.variance_description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {workingPaper.varianceAnalysis.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{t('workpapers.no_variance_analysis')}</p>
                      </div>
                    ) : (
                      <EnhancedTable title="Variance Analysis">
                        <Table className="border-separate border-spacing-0">
                          <TableHeader className="sticky top-0 z-10">
                            <TableRow className="bg-background/95 backdrop-blur-sm border-b-2">
                              <TableHead className="min-w-[120px] sticky left-0 bg-background/95 backdrop-blur-sm border-r">
                                {t('workpapers.account_number')}
                              </TableHead>
                              <TableHead className="min-w-[200px] sticky left-[120px] bg-background/95 backdrop-blur-sm border-r">
                                {t('workpapers.account_name')}
                              </TableHead>
                              <TableHead className="min-w-[140px] text-right border-r">
                                {t('workpapers.actual')}
                              </TableHead>
                              <TableHead className="min-w-[140px] text-right border-r">
                                {t('workpapers.expected')}
                              </TableHead>
                              <TableHead className="min-w-[120px] text-right border-r">
                                {t('workpapers.variance')}
                              </TableHead>
                              <TableHead className="min-w-[140px] text-right">
                                {t('workpapers.percentage_variance')}
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workingPaper.varianceAnalysis.map((variance, index) => (
                              <TableRow key={index} className="hover:bg-muted/50 transition-colors duration-150">
                                <TableCell className="font-mono sticky left-0 bg-background/95 backdrop-blur-sm border-r">
                                  {variance.accountNumber}
                                </TableCell>
                                <TableCell className="font-medium sticky left-[120px] bg-background/95 backdrop-blur-sm border-r">
                                  {variance.accountName}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(variance.actual)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  {formatCurrency(variance.expected)}
                                </TableCell>
                                <TableCell className="text-right font-mono border-r">
                                  <Badge variant={variance.variance >= 0 ? "secondary" : "destructive"}>
                                    {formatCurrency(variance.variance)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  <Badge variant={variance.percentageVariance >= 0 ? "secondary" : "destructive"}>
                                    {formatPercentage(variance.percentageVariance)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </EnhancedTable>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Supporting Documents */}
            {workingPaper.supportingDocuments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('workpapers.supporting_documents')}</CardTitle>
                  <CardDescription>
                    {t('workpapers.supporting_docs_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {workingPaper.supportingDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-end pt-4">
              <Button onClick={onClose}>
                {t('workpapers.close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
      {children}
    </label>
  );
}
