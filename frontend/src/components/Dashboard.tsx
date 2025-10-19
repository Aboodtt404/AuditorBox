import React from 'react';
import { useLanguage } from './LanguageProvider';
import { useGetCallerUserProfile, useGetAllOrganizations, useGetAllEntities, useGetAllEngagements, useGetAllActivityLogs } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Building, Briefcase, Activity, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: organizations = [] } = useGetAllOrganizations();
  const { data: entities = [] } = useGetAllEntities();
  const { data: engagements = [] } = useGetAllEngagements();
  const { data: activityLogs = [] } = useGetAllActivityLogs();

  const activeEngagements = engagements.filter(e => 
    e.status === 'in_progress' || e.status === 'planning'
  );

  const recentActivity = activityLogs
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, 5);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1000000n));
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome')}, {userProfile?.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('dashboard.overview')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.total_organizations')}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.total_entities')}
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entities.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.active_engagements')}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEngagements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.total_engagements')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.recent_activities')}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityLogs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
          <CardDescription>
            {t('dashboard.activity_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              {t('activity.no_activity')}
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {t('dashboard.activity_badge')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
