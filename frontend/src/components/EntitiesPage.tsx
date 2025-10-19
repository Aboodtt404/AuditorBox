import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useGetAllEntities, useGetAllOrganizations } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Building, FileText } from 'lucide-react';
import EntityFormModal from './EntityFormModal';

const TAXONOMY_INFO = {
  'us_gaap': { label: 'US GAAP', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  'ifrs': { label: 'IFRS', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  'gaap_canada': { label: 'GAAP Canada', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  'uk_gaap': { label: 'UK GAAP', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  'other': { label: 'Other', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' },
};

export default function EntitiesPage() {
  const { t } = useLanguage();
  const { data: entities = [], isLoading } = useGetAllEntities();
  const { data: organizations = [] } = useGetAllOrganizations();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEntity, setEditingEntity] = useState<string | null>(null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString();
  };

  const getOrganizationName = (organizationId: string) => {
    const organization = organizations.find(o => o.id === organizationId);
    return organization?.name || organizationId;
  };

  const getTaxonomyBadge = (taxonomy: string) => {
    const taxonomyInfo = TAXONOMY_INFO[taxonomy as keyof typeof TAXONOMY_INFO] || TAXONOMY_INFO.other;
    return (
      <Badge variant="outline" className={taxonomyInfo.color}>
        <FileText className="h-3 w-3 mr-1" />
        {taxonomyInfo.label}
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
          <h1 className="text-3xl font-bold text-foreground">{t('entities.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('entities.subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('entities.add_new')}
        </Button>
      </div>

      {/* Entities Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('entities.all_entities')}</CardTitle>
          <CardDescription>
            {t('entities.table_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entities.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">{t('entities.no_entities')}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {t('entities.create_first')}
              </p>
              <Button onClick={() => setShowCreateModal(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('entities.add_new')}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('entities.name')}</TableHead>
                  <TableHead>{t('entities.organization')}</TableHead>
                  <TableHead>{t('entities.taxonomy')}</TableHead>
                  <TableHead>{t('entities.description')}</TableHead>
                  <TableHead>{t('entities.created_at')}</TableHead>
                  <TableHead className="text-right">{t('entities.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell className="font-medium">{entity.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Building className="h-3 w-3" />
                        {getOrganizationName(entity.organizationId)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getTaxonomyBadge(entity.taxonomy)}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={entity.description}>
                        {entity.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {formatDate(entity.createdAt)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEntity(entity.id)}
                        >
                          <Edit className="h-4 w-4" />
                          {t('entities.edit')}
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
        <EntityFormModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
      
      {editingEntity && (
        <EntityFormModal
          entityId={editingEntity}
          onClose={() => setEditingEntity(null)}
        />
      )}
    </div>
  );
}
