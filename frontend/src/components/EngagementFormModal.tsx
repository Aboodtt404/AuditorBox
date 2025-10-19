import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { useCreateEngagement, useUpdateEngagement, useGetEngagement, useGetAllOrganizations, useGetAllEntities } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Building2 } from 'lucide-react';

interface EngagementFormModalProps {
  engagementId?: string;
  onClose: () => void;
}

export default function EngagementFormModal({ engagementId, onClose }: EngagementFormModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [entityId, setEntityId] = useState('');
  const [status, setStatus] = useState('planning');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const createEngagement = useCreateEngagement();
  const updateEngagement = useUpdateEngagement();
  const { data: existingEngagement } = useGetEngagement(engagementId || '');
  const { data: organizations = [] } = useGetAllOrganizations();
  const { data: entities = [] } = useGetAllEntities();

  const isEditing = !!engagementId;
  const isLoading = createEngagement.isPending || updateEngagement.isPending;

  const statusOptions = [
    { value: 'planning', label: t('status.planning') },
    { value: 'in_progress', label: t('status.in_progress') },
    { value: 'review', label: t('status.review') },
    { value: 'completed', label: t('status.completed') },
    { value: 'on_hold', label: t('status.on_hold') },
  ];

  // Filter entities based on selected organization
  const availableEntities = entities.filter(entity => entity.organizationId === organizationId);

  useEffect(() => {
    if (existingEngagement) {
      setName(existingEngagement.name);
      setOrganizationId(existingEngagement.organizationId);
      setEntityId(existingEngagement.entityId);
      setStatus(existingEngagement.status);
      
      // Convert timestamps to date strings
      const startDateObj = new Date(Number(existingEngagement.startDate / 1000000n));
      const endDateObj = new Date(Number(existingEngagement.endDate / 1000000n));
      
      setStartDate(startDateObj.toISOString().split('T')[0]);
      setEndDate(endDateObj.toISOString().split('T')[0]);
    }
  }, [existingEngagement]);

  // Reset entity selection when organization changes
  useEffect(() => {
    if (!isEditing && organizationId) {
      setEntityId('');
    }
  }, [organizationId, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !organizationId || !entityId || !startDate || !endDate) return;

    // Convert dates to nanosecond timestamps
    const startTimestamp = BigInt(new Date(startDate).getTime() * 1000000);
    const endTimestamp = BigInt(new Date(endDate).getTime() * 1000000);

    const engagementData = {
      id: engagementId || `engagement_${Date.now()}`,
      organizationId,
      entityId,
      name: name.trim(),
      startDate: startTimestamp,
      endDate: endTimestamp,
      status,
    };

    try {
      if (isEditing) {
        await updateEngagement.mutateAsync(engagementData);
      } else {
        await createEngagement.mutateAsync(engagementData);
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
            {isEditing ? t('engagement_form.edit_title') : t('engagement_form.create_title')}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t('engagement_form.edit_description')
              : t('engagement_form.create_description')
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('engagement_form.name_label')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('engagement_form.name_placeholder')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organization">{t('engagement_form.organization_label')}</Label>
            <Select value={organizationId} onValueChange={setOrganizationId} required>
              <SelectTrigger>
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('engagement_form.organization_placeholder')} />
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
            <Label htmlFor="entity">{t('engagement_form.entity_label')}</Label>
            <Select value={entityId} onValueChange={setEntityId} required disabled={!organizationId}>
              <SelectTrigger>
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('engagement_form.entity_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {availableEntities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {organizationId && availableEntities.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t('engagement_form.no_entities_message')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('engagement_form.start_date_label')}</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">{t('engagement_form.end_date_label')}</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">{t('engagement_form.status_label')}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t('engagement_form.status_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              {t('engagement_form.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !name.trim() || !organizationId || !entityId || !startDate || !endDate}
            >
              {isLoading 
                ? (isEditing ? t('engagement_form.updating') : t('engagement_form.creating'))
                : (isEditing ? t('engagement_form.update') : t('engagement_form.create'))
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
