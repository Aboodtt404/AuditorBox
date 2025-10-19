import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { useCreateEntity, useUpdateEntity, useGetEntity, useGetAllOrganizations } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, FileText } from 'lucide-react';

interface EntityFormModalProps {
  entityId?: string;
  onClose: () => void;
}

const TAXONOMIES = [
  { value: 'us_gaap', label: 'US GAAP', description: 'United States Generally Accepted Accounting Principles' },
  { value: 'ifrs', label: 'IFRS', description: 'International Financial Reporting Standards' },
  { value: 'gaap_canada', label: 'GAAP Canada', description: 'Canadian Generally Accepted Accounting Principles' },
  { value: 'uk_gaap', label: 'UK GAAP', description: 'United Kingdom Generally Accepted Accounting Principles' },
  { value: 'other', label: 'Other', description: 'Other accounting standards' },
];

export default function EntityFormModal({ entityId, onClose }: EntityFormModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [description, setDescription] = useState('');
  const [taxonomy, setTaxonomy] = useState('us_gaap');
  
  const createEntity = useCreateEntity();
  const updateEntity = useUpdateEntity();
  const { data: existingEntity } = useGetEntity(entityId || '');
  const { data: organizations = [] } = useGetAllOrganizations();

  const isEditing = !!entityId;
  const isLoading = createEntity.isPending || updateEntity.isPending;

  useEffect(() => {
    if (existingEntity) {
      setName(existingEntity.name);
      setOrganizationId(existingEntity.organizationId);
      setDescription(existingEntity.description);
      setTaxonomy(existingEntity.taxonomy);
    }
  }, [existingEntity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !organizationId || !description.trim()) return;

    const entityData = {
      id: entityId || `entity_${Date.now()}`,
      organizationId,
      name: name.trim(),
      description: description.trim(),
      taxonomy,
    };

    try {
      if (isEditing) {
        await updateEntity.mutateAsync(entityData);
      } else {
        await createEntity.mutateAsync(entityData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('entity_form.edit_title') : t('entity_form.create_title')}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t('entity_form.edit_description')
              : t('entity_form.create_description')
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('entity_form.name_label')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('entity_form.name_placeholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">{t('entity_form.organization_label')}</Label>
            <Select value={organizationId} onValueChange={setOrganizationId} required>
              <SelectTrigger>
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('entity_form.organization_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((organization) => (
                  <SelectItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxonomy">{t('entity_form.taxonomy_label')}</Label>
            <Select value={taxonomy} onValueChange={setTaxonomy}>
              <SelectTrigger>
                <FileText className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('entity_form.taxonomy_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {TAXONOMIES.map((tax) => (
                  <SelectItem key={tax.value} value={tax.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{tax.label}</span>
                      <span className="text-xs text-muted-foreground">{tax.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('entity_form.description_label')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('entity_form.description_placeholder')}
              rows={3}
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t('entity_form.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !name.trim() || !organizationId || !description.trim()}
            >
              {isLoading 
                ? (isEditing ? t('entity_form.updating') : t('entity_form.creating'))
                : (isEditing ? t('entity_form.update') : t('entity_form.create'))
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
