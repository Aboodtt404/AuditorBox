import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Chip,
  CircularProgress,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  VerifiedUser as VerifiedIcon,
  Error as ErrorIcon,
  ContentCopy as CopyIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useBackend } from '../hooks/useBackend';

interface BlockchainProof {
  entry_id: bigint;
  data_hash: string;
  timestamp: bigint;
  block_height: bigint;
  signature: string;
  previous_hash: string;
}

interface VerificationResult {
  is_valid: boolean;
  entry_id: bigint;
  timestamp: bigint;
  data_hash: string;
  block_height: bigint;
  verification_timestamp: bigint;
  chain_integrity: boolean;
  message: string;
}

interface BlockchainVerificationProps {
  entryId: number;
  compact?: boolean;
}

export const BlockchainVerification: React.FC<BlockchainVerificationProps> = ({
  entryId,
  compact = false,
}) => {
  const { call } = useBackend();
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<BlockchainProof | null>(null);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get blockchain proof
      const proofResult = await call<BlockchainProof>('get_blockchain_proof', [BigInt(entryId)]);
      setProof(proofResult);

      // Verify the entry
      const verifyResult = await call<VerificationResult>('verify_activity_log', [BigInt(entryId)]);
      setVerification(verifyResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString();
  };

  const formatHash = (hash: string): string => {
    if (hash.length <= 16) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  if (compact) {
    return (
      <Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<VerifiedIcon />}
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify on Blockchain'}
        </Button>
        {verification && (
          <Chip
            icon={verification.is_valid ? <CheckIcon /> : <ErrorIcon />}
            label={verification.is_valid ? 'Verified' : 'Invalid'}
            color={verification.is_valid ? 'success' : 'error'}
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Box>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <VerifiedIcon color="primary" />
              Blockchain Verification
            </Typography>
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <VerifiedIcon />}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </Box>

          <Divider />

          {error && (
            <Alert severity="error">
              <AlertTitle>Verification Error</AlertTitle>
              {error}
            </Alert>
          )}

          {verification && (
            <>
              <Alert
                severity={verification.is_valid ? 'success' : 'error'}
                icon={verification.is_valid ? <VerifiedIcon /> : <ErrorIcon />}
              >
                <AlertTitle>
                  {verification.is_valid
                    ? 'Blockchain Integrity Confirmed'
                    : 'Verification Failed'}
                </AlertTitle>
                {verification.message}
              </Alert>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Verification Details
                </Typography>
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Entry ID:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {verification.entry_id.toString()}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Block Height:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {verification.block_height.toString()}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Timestamp:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatTimestamp(verification.timestamp)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Verified At:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatTimestamp(verification.verification_timestamp)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </>
          )}

          {proof && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Blockchain Proof
                </Typography>
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Data Hash:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        fontSize="0.75rem"
                      >
                        {formatHash(proof.data_hash)}
                      </Typography>
                      <Tooltip title="Copy full hash">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(proof.data_hash)}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Signature:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        fontSize="0.75rem"
                      >
                        {formatHash(proof.signature)}
                      </Typography>
                      <Tooltip title="Copy full signature">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(proof.signature)}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Previous Hash:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      fontSize="0.75rem"
                    >
                      {formatHash(proof.previous_hash)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Alert severity="info" icon={<QrCodeIcon />}>
                <Typography variant="body2">
                  This entry is permanently recorded on the Internet Computer blockchain.
                  The cryptographic signature ensures that any tampering can be detected.
                </Typography>
              </Alert>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

interface ChainVerificationProps {
  onVerify?: (isValid: boolean) => void;
}

export const ChainVerification: React.FC<ChainVerificationProps> = ({ onVerify }) => {
  const { call } = useBackend();
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await call<boolean>('verify_blockchain_chain', []);
      setIsValid(result);
      onVerify?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chain verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <VerifiedIcon color="primary" />
              Verify Entire Audit Trail Chain
            </Typography>
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <VerifiedIcon />}
            >
              {loading ? 'Verifying...' : 'Verify Chain'}
            </Button>
          </Box>

          <Divider />

          <Typography variant="body2" color="text.secondary">
            Verify the integrity of the entire blockchain audit trail by checking that
            all entries are correctly linked and no tampering has occurred.
          </Typography>

          {error && (
            <Alert severity="error">
              <AlertTitle>Verification Error</AlertTitle>
              {error}
            </Alert>
          )}

          {isValid !== null && (
            <Alert
              severity={isValid ? 'success' : 'error'}
              icon={isValid ? <VerifiedIcon /> : <ErrorIcon />}
            >
              <AlertTitle>
                {isValid ? 'Chain Integrity Verified' : 'Chain Integrity Failed'}
              </AlertTitle>
              {isValid
                ? 'All audit trail entries are properly linked and verified. The blockchain chain is intact.'
                : 'The audit trail chain has been compromised. One or more entries do not link correctly.'}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

