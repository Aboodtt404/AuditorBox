import React from 'react';
import { useLanguage } from './LanguageProvider';
import { useGetAllActivityLogs } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';

export default function ActivityLogPage() {
  const { t } = useLanguage();
  const { data: activityLogs = [], isLoading } = useGetAllActivityLogs();

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / 1000000n));
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const sortedLogs = [...activityLogs].sort((a, b) => 
    Number(b.timestamp - a.timestamp)
  );

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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('activity.title')}</h1>
          <p className="text-muted-foreground mt-2">
            Track all activities and changes in your audit system
          </p>
        </div>
      </div>

      {/* Activity Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>
            Chronological log of all user actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedLogs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">{t('activity.no_activity')}</p>
              <p className="text-sm text-muted-foreground">
                Activity will appear here as you use the system
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('activity.action')}</TableHead>
                  <TableHead>{t('activity.user')}</TableHead>
                  <TableHead>{t('activity.timestamp')}</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs.map((log) => {
                  const { date, time } = formatTimestamp(log.timestamp);
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.userId.toString().slice(0, 8)}...
                        </Badge>
                      </TableCell>
                      <TableCell>{time}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {date}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
