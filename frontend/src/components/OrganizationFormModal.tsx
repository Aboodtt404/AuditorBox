import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { useCreateOrganization, useUpdateOrganization, useGetOrganization } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface OrganizationFormModalProps {
  organizationId?: string;
  onClose: () => void;
}

export default function OrganizationFormModal({ organizationId, onClose }: OrganizationFormModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();
  const { data: existingOrganization } = useGetOrganization(organizationId || '');

  const isEditing = !!organizationId;
  const isLoading = createOrganization.isPending || updateOrganization.isPending;

  useEffect(() => {
    if (existingOrganization) {
      setName(existingOrganization.name);
      setDescription(existingOrganization.description);
    }
  }, [existingOrganization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) return;

    const organizationData = {
      id: organizationId || `organization_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
    };

    try {
      if (isEditing) {
        await updateOrganization.mutateAsync(organizationData);
      } else {
        await createOrganization.mutateAsync(organizationData);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('organization_form.edit_title') : t('organization_form.create_title')}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t('organization_form.edit_description')
              : t('organization_form.create_description')
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('organization_form.name_label')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('organization_form.name_placeholder')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('organization_form.description_label')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('organization_form.description_placeholder')}
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
              {t('organization_form.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !name.trim() || !description.trim()}
            >
              {isLoading 
                ? (isEditing ? t('organization_form.updating') : t('organization_form.creating'))
                : (isEditing ? t('organization_form.update') : t('organization_form.create'))
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
