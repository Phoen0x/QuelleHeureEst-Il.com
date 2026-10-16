#!/usr/bin/env bash
set -euo pipefail
# FR : isoler le réseau au niveau du noyau avant de retirer les privilèges et les credentials.
# EN: Isolate networking in the kernel before dropping privileges and credentials.
ci_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source_directory="$(git -C "$ci_directory" rev-parse --show-toplevel)"
runtime_path="$(dirname -- "$(command -v node)"):/usr/local/bin:/usr/bin:/bin"
host_network="$(readlink /proc/self/ns/net)"
runner_uid="$(id -u)"
runner_gid="$(id -g)"
clean_home="$AUDIT_OUTPUT/clean-home"
mkdir -p "$clean_home"
sudo --non-interactive unshare --mount --net --fork /bin/bash -s -- \
  "$source_directory" "$AUDIT_TOOLS" "$AUDIT_UPSTREAM" "$AUDIT_OUTPUT" \
  "$runtime_path" "$clean_home" "$host_network" "$runner_uid" "$runner_gid" <<'ISOLATED'
set -euo pipefail
mount --make-rprivate /
for directory in "$1" "$2" "$3"; do
  mount --bind "$directory" "$directory"
  mount -o remount,bind,ro "$directory"
done
exec env -i PATH="$5" HOME="$6" AUDIT_TOOLS="$2" AUDIT_UPSTREAM="$3" AUDIT_OUTPUT="$4" \
  AUDIT_HOST_NETNS="$7" GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null \
  /usr/bin/setpriv --reuid="$8" --regid="$9" --clear-groups \
  --bounding-set=-all --inh-caps=-all --ambient-caps=-all --no-new-privs \
  /bin/bash "$1/docs/audits/renovate-ci-170/offline-inner.sh"
ISOLATED
