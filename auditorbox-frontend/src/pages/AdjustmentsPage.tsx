import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/api-functions';
import AdjustmentList from '../components/adjustments/AdjustmentList';
import AdjustmentModal from '../components/adjustments/AdjustmentModal';
import { CreateAjeRequest } from '../declarations/auditorbox_backend/auditorbox_backend.did';
import { useEngagement } from '../hooks/useEngagement';
import { toast } from 'sonner';

const AdjustmentsPage: React.FC = () => {
    const { engagementId, config } = useEngagement();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    // Fetch adjustments
    const { data: adjustmentsData, isLoading, error } = useQuery({
        queryKey: ['listAdjustments'],
        queryFn: () => api.listAdjustments(),
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (req: CreateAjeRequest) => api.createAdjustment(req),
        onSuccess: (result) => {
            if ('ok' in result) {
                toast.success('Adjustment created successfully');
                queryClient.invalidateQueries({ queryKey: ['listAdjustments'] });
                setIsModalOpen(false);
            } else {
                toast.error(`Failed to create adjustment: ${result.err}`);
            }
        },
        onError: (err) => {
            toast.error(`Error: ${String(err)}`);
        },
    });

    // Update status mutation
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: any }) =>
            api.updateAdjustmentStatus(BigInt(id), { [status]: null } as any), // Backend expects variant
        onSuccess: (result) => {
            if ('ok' in result) {
                toast.success('Status updated');
                queryClient.invalidateQueries({ queryKey: ['listAdjustments'] });
            } else {
                toast.error(`Failed to update status: ${result.err}`);
            }
        }
    });


    // Transform data for UI
    // Backend returns [id, Adjustment] tuples usually, or list of Adjustments. 
    // api.listAdjustments returns Array<[bigint, Adjustment]>
    const adjustments = React.useMemo(() => {
        if (!adjustmentsData) return [];
        return adjustmentsData.map(([id, adj]) => ({
            id: id.toString(),
            description: adj.description,
            entries: adj.lineItems.map(li => ({
                account: `${li.accountNumber} - ${li.accountName}`,
                debit: li.debit,
                credit: li.credit
            })),
            // Map variant to string status
            status: Object.keys(adj.status)[0],
            createdBy: adj.createdBy.toText().slice(0, 5) + '...', // Short principal or look up name
            createdAt: new Date(Number(adj.createdAt / 1_000_000n)).toISOString(), // Nano to ms
            reviewedBy: adj.reviewedBy.length > 0 ? adj.reviewedBy[0].toText().slice(0, 5) + '...' : undefined
        }));
    }, [adjustmentsData]);

    const handleCreate = (req: CreateAjeRequest) => {
        createMutation.mutate(req);
    };

    const handleUpdateStatus = (id: string, status: string) => {
        updateStatusMutation.mutate({ id, status });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-background-dark text-slate-400">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-icons animate-spin text-4xl">sync</span>
                    <span>Loading Adjustments...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-background-dark text-red-400">
                Error loading adjustments: {String(error)}
            </div>
        );
    }

    // We need a trial balance ID. For now, we might need to fetch it or pick the first one.
    // Ideally this comes from context or selector.
    // For MVP, we'll fetch listTrialBalances and pick the first one.
    return <AdjustmentsPageContent
        adjustments={adjustments}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleCreate={handleCreate}
        handleUpdateStatus={handleUpdateStatus}
        engagementId={engagementId}
    />
};

const AdjustmentsPageContent: React.FC<{
    adjustments: any[];
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    handleCreate: (req: CreateAjeRequest) => void;
    handleUpdateStatus: (id: string, status: string) => void;
    engagementId: bigint;
}> = ({ adjustments, isModalOpen, setIsModalOpen, handleCreate, handleUpdateStatus, engagementId }) => {

    // Need trial balance ID
    const { data: tbData } = useQuery({
        queryKey: ['listTrialBalances'],
        queryFn: () => api.listTrialBalances()
    });

    const trialBalanceId = tbData && tbData.length > 0 ? tbData[0][0] : BigInt(0);

    return (
        <>
            <AdjustmentList
                adjustments={adjustments}
                onCreateNew={() => setIsModalOpen(true)}
                onUpdateStatus={handleUpdateStatus}
                onSelect={(id) => console.log('Select', id)}
            />

            {trialBalanceId && (
                <AdjustmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleCreate}
                    engagementId={engagementId}
                    trialBalanceId={trialBalanceId}
                />
            )}
        </>
    );
}

export default AdjustmentsPage;
