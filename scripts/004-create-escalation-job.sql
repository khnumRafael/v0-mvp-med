-- Scheduled job for processing escalation alerts
-- This would be set up using pg_cron or external scheduler

-- Example: Process alerts every 15 minutes
-- SELECT cron.schedule('process-alerts', '*/15 * * * *', 'SELECT process_alerts_queue()');

-- Function to be called by scheduler
CREATE OR REPLACE FUNCTION medtime.process_alerts_queue()
RETURNS TABLE(processed INT) AS $$
BEGIN
  -- This would be called by the API endpoint
  -- /api/alertas/processar
  -- 
  -- For production, this should be triggered by:
  -- - Vercel Cron Jobs
  -- - AWS EventBridge
  -- - Kubernetes CronJob
  -- - External scheduler
  
  RETURN QUERY SELECT 0;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION medtime.process_alerts_queue IS 
'Scheduled function to process pending escalation alerts. Should be called every 15 minutes.';
