// FR : proposition de gel global du transport, jamais branchée sur un service réel.
// EN: Proposed global transport freeze, never attached to a real service.
export function rejectWrite(method, target) {
  const error = new Error(`AUDIT_WRITE_DENIED ${method} ${target}`);
  error.code = 'AUDIT_WRITE_DENIED';
  throw error;
}
