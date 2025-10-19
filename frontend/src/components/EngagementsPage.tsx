import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useGetAllEngagements, useGetAllOrganizations, useGetAllEntities } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Building, Building2 } from 'lucide-react';
import EngagementFormModal from './EngagementFormModal';

export default function EngagementsPage() {
  const { t } = useLanguage();
  const { data: engagements = [], isLoading } = useGetAllEngagements();
  const { data: organizations = [] } = useGetAllOrganizations();
  const { data: entities = [] } = useGetAllEntities();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEngagement, setEditingEngagement] = useState<string | null>(null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString();
  };

  const getOrganizationName = (organizationId: string) => {
    const organization = organizations.find(o => o.id === organizationId);
    return organization?.name || organizationId;
  };

  const getEntityName = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    return entity?.name || entityId;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'planning': { variant: 'secondary' as const, label: t('status.planning') },
      'in_progress': { variant: 'default' as const, label: t('status.in_progress') },
      'review': { variant: 'outline' as const, label: t('status.review') },
      'completed': { variant: 'secondary' as const, label: t('status.completed') },
      'on_hold': { variant: 'destructive' as const, label: t('status.on_hold') },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      variant: 'secondary' as const, 
      label: status 
    };
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('engagements.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('engagements.subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('engagements.add_new')}
        </Button>
      </div>

      {/* Engagements Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('engagements.all_engagements')}</CardTitle>
          <CardDescription>
            {t('engagements.table_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {engagements.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">{t('engagements.no_engagements')}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {t('engagements.create_first')}
              </p>
              <Button onClick={() => setShowCreateModal(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('engagements.add_new')}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('engagements.name')}</TableHead>
                  <TableHead>{t('engagements.organization')}</TableHead>
                  <TableHead>{t('engagements.entity')}</TableHead>
                  <TableHead>{t('engagements.status')}</TableHead>
                  <TableHead>{t('engagements.start_date')}</TableHead>
                  <TableHead>{t('engagements.end_date')}</TableHead>
                  <TableHead className="text-right">{t('engagements.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagements.map((engagement) => (
                  <TableRow key={engagement.id}>
                    <TableCell className="font-medium">{engagement.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Building2 className="h-3 w-3" />
                        {getOrganizationName(engagement.organizationId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Building className="h-3 w-3" />
                        {getEntityName(engagement.entityId)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(engagement.status)}</TableCell>
                    <TableCell>{formatDate(engagement.startDate)}</TableCell>
                    <TableCell>{formatDate(engagement.endDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEngagement(engagement.id)}
                        >
                          <Edit className="h-4 w-4" />
                          {t('engagements.edit')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <EngagementFormModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
      
      {editingEngagement && (
        <EngagementFormModal
          engagementId={editingEngagement}
          onClose={() => setEditingEngagement(null)}
        />
      )}
    </div>
  );
}
