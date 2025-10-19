import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useSaveUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfileSetupModal() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const saveProfile = useSaveUserProfile();

  const handleSave = async () => {
    if (name.trim()) {
      saveProfile.mutate({ name: name.trim() });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('profile.setup_title')}</DialogTitle>
          <DialogDescription>
            {t('profile.setup_subtitle')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('profile.name_label')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.name_placeholder')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full"
          >
            {saveProfile.isPending ? t('profile.saving') : t('profile.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
