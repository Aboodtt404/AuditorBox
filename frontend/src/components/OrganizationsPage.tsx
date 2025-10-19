import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useGetAllOrganizations } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Building2 } from 'lucide-react';
import OrganizationFormModal from './OrganizationFormModal';

export default function OrganizationsPage() {
  const { t } = useLanguage();
  const { data: organizations = [], isLoading } = useGetAllOrganizations();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<string | null>(null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString();
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
          <h1 className="text-3xl font-bold text-foreground">{t('organizations.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('organizations.subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('organizations.add_new')}
        </Button>
      </div>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('organizations.all_organizations')}</CardTitle>
          <CardDescription>
            {t('organizations.table_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organizations.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">{t('organizations.no_organizations')}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {t('organizations.create_first')}
              </p>
              <Button onClick={() => setShowCreateModal(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                {t('organizations.add_new')}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('organizations.name')}</TableHead>
                  <TableHead>{t('organizations.description')}</TableHead>
                  <TableHead>{t('organizations.created_at')}</TableHead>
                  <TableHead className="text-right">{t('organizations.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((organization) => (
                  <TableRow key={organization.id}>
                    <TableCell className="font-medium">{organization.name}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={organization.description}>
                        {organization.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {formatDate(organization.createdAt)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingOrganization(organization.id)}
                        >
                          <Edit className="h-4 w-4" />
                          {t('organizations.edit')}
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
        <OrganizationFormModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
      
      {editingOrganization && (
        <OrganizationFormModal
          organizationId={editingOrganization}
          onClose={() => setEditingOrganization(null)}
        />
      )}
    </div>
  );
}
