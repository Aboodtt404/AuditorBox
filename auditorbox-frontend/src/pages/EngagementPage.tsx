// Engagement page — auto-generated from .did
// Generated: 2026-02-08T19:16:01.410430

import React, { useState } from 'react';
import * as api from '../api/api-functions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const EngagementPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['listEngagements'],
    queryFn: () => api.listEngagements(),
  });

  const qc = useQueryClient();
  const createMutation = useMutation({
    mutationFn: (args: any) => api.createEngagement(args),
    onSuccess: () => qc.invalidateQueries(),
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Engagement</h2>
      {isLoading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">Error: {String(error)}</p>}
      {data && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr><th className="p-3">ID</th><th className="p-3">Data</th></tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.map((item: any, i: number) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-mono text-sm">{JSON.stringify(item, (_, v) => typeof v === 'bigint' ? v.toString() : v).slice(0, 200)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EngagementPage;