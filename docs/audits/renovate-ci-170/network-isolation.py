#!/usr/bin/env python3
import errno
import json
import os
import socket
import sys
from pathlib import Path

output = Path(os.environ['AUDIT_OUTPUT'])
source = Path(__file__).resolve().parents[3]
network = os.readlink('/proc/self/ns/net')
if network == os.environ['AUDIT_HOST_NETNS']:
    raise RuntimeError('Le rejeu partage le réseau hôte')
if os.getuid() == 0:
    raise RuntimeError('Le rejeu conserve les privilèges root')
allowed = {'PATH', 'HOME', 'AUDIT_TOOLS', 'AUDIT_UPSTREAM', 'AUDIT_OUTPUT', 'AUDIT_HOST_NETNS', 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_SYSTEM', 'PWD', 'SHLVL', '_', 'LC_CTYPE'}
unexpected = set(os.environ) - allowed
if unexpected:
    raise RuntimeError('Variables non autorisées dans le rejeu : ' + ', '.join(sorted(unexpected)))
status = dict(line.split(':', 1) for line in Path('/proc/self/status').read_text().splitlines() if ':' in line)
if int(status['CapEff'].strip(), 16) != 0 or status['NoNewPrivs'].strip() != '1':
    raise RuntimeError('Capacités ou élévation de privilèges encore disponibles')
for directory in [source, Path(os.environ['AUDIT_TOOLS']), Path(os.environ['AUDIT_UPSTREAM'])]:
    if not os.statvfs(directory).f_flag & os.ST_RDONLY:
        raise RuntimeError('Source ou outil non monté en lecture seule : ' + str(directory))
interfaces = socket.if_nameindex()
if [name for _, name in interfaces] != ['lo']:
    raise RuntimeError('Interface réseau externe présente')
probes = []
for target in [('1.1.1.1', 443), ('127.0.0.1', 443)]:
    with socket.socket() as probe:
        probe.settimeout(2)
        result = probe.connect_ex(target)
        if result not in [errno.ENETUNREACH, errno.EHOSTUNREACH, errno.ECONNREFUSED, errno.EADDRNOTAVAIL]:
            raise RuntimeError(f'Isolement réseau non confirmé : {result}')
        probes.append({'host': target[0], 'errno': result, 'connected': False})
report = {'phase': sys.argv[1], 'namespace_differs_from_host': True, 'uid': os.getuid(), 'effective_capabilities': 0, 'no_new_privileges': True, 'source_tools_upstream_readonly': True, 'environment_keys': sorted(os.environ), 'interfaces': interfaces, 'probes': probes}
(output / f'isolation-{sys.argv[1]}.json').write_text(json.dumps(report, indent=2) + '\n')
print('PASS : espace réseau distinct, aucune connexion, sources read-only, aucun token et capacités retirées')
