import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useGetAllWorkingPapers, useGetAllEngagements, useGetAllOrganizations, useGetAllEntities } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, TrendingUp, Calculator, BarChart3, Building2, Building, Eye, Edit } from 'lucide-react';
import WorkingPaperFormModal from './WorkingPaperFormModal';
import WorkingPaperViewModal from './WorkingPaperViewModal';
import { WorkingPaper } from '../backend';

export default function WorkingPapersPage() {
  const { t } = useLanguage();
  const { data: workingPapers = [], isLoading } = useGetAllWorkingPapers();
  const { data: engagements = [] } = useGetAllEngagements();
  const { data: organizations = [] } = useGetAllOrganizations();
  const { data: entities = [] } = useGetAllEntities();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkingPaper, setEditingWorkingPaper] = useState<string | null>(null);
  const [viewingWorkingPaper, setViewingWorkingPaper] = useState<WorkingPaper | null>(null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString();
  };

  const getEngagementName = (engagementId: string) => {
    const engagement = engagements.find(e => e.id === engagementId);
    return engagement?.name || engagementId;
  };

  const getOrganizationName = (engagementId: string) => {
    const engagement = engagements.find(e => e.id === engagementId);
    if (!engagement) return '';
    const organization = organizations.find(o => o.id === engagement.organizationId);
    return organization?.name || '';
  };

  const getEntityName = (engagementId: string) => {
    const engagement = engagements.find(e => e.id === engagementId);
    if (!engagement) return '';
    const entity = entities.find(e => e.id === engagement.entityId);
    return entity?.name || '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('workpapers.title')}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {t('workpapers.subtitle')}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('workpapers.add_new')}
        </Button>
      </div>

      {/* Working Papers Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('workpapers.total_papers')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workingPapers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('workpapers.with_ratios')}</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workingPapers.filter(wp => wp.financialRatios.length > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('workpapers.with_trends')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workingPapers.filter(wp => wp.trendAnalysis.length > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('workpapers.with_variance')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workingPapers.filter(wp => wp.varianceAnalysis.length > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Papers Table */}
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            {t('workpapers.all_papers')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('workpapers.table_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workingPapers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">{t('workpapers.no_papers')}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {t('workpapers.create_first')}
              </p>
              <Button onClick={() => setShowCreateModal(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('workpapers.add_new')}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold min-w-[200px]">{t('workpapers.name')}</TableHead>
                    <TableHead className="font-semibold min-w-[150px]">{t('workpapers.engagement')}</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">{t('workpapers.organization')}</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">{t('workpapers.entity')}</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">{t('workpapers.accounts')}</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">{t('workpapers.ratios')}</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">{t('workpapers.created_at')}</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">{t('workpapers.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workingPapers.map((workingPaper) => (
                    <TableRow key={workingPaper.id} className="hover:bg-muted/50 transition-colors duration-150">
                      <TableCell className="font-medium">{workingPaper.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <FileText className="h-3 w-3" />
                          {getEngagementName(workingPaper.engagementId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Building2 className="h-3 w-3" />
                          {getOrganizationName(workingPaper.engagementId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Building className="h-3 w-3" />
                          {getEntityName(workingPaper.engagementId)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {workingPaper.accountBalances.length} accounts
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {workingPaper.financialRatios.length} ratios
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(workingPaper.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingWorkingPaper(workingPaper)}
                          >
                            <Eye className="h-4 w-4" />
                            {t('workpapers.view')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingWorkingPaper(workingPaper.id)}
                          >
                            <Edit className="h-4 w-4" />
                            {t('workpapers.edit')}
                          </Button>
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

      {/* Modals */}
      {showCreateModal && (
        <WorkingPaperFormModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
      
      {editingWorkingPaper && (
        <WorkingPaperFormModal
          workingPaperId={editingWorkingPaper}
          onClose={() => setEditingWorkingPaper(null)}
        />
      )}

      {viewingWorkingPaper && (
        <WorkingPaperViewModal
          workingPaper={viewingWorkingPaper}
          onClose={() => setViewingWorkingPaper(null)}
        />
      )}
    </div>
  );
}
