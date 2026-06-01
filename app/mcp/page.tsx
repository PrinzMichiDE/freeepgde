'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { SiteHeader } from '@/components/site-header';

interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

interface ServerInfo {
  server: string;
  version: string;
  endpoints: { post: string; stream: string };
  tools: MCPTool[];
  resources: MCPResource[];
}

const BASIC_EXAMPLES = ['initialize', 'tools/list', 'tools/call', 'resources/list', 'ping'];
const TV_EXAMPLES = [
  'get_available_countries',
  'get_channels',
  'get_current_programmes',
  'search_programmes',
];

export default function MCPInterfacePage() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<unknown>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamMessages, setStreamMessages] = useState<string[]>([]);
  const [requestBody, setRequestBody] = useState(`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}`);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    loadServerInfo();
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const loadServerInfo = async () => {
    try {
      const res = await fetch('/api/mcp');
      const data = await res.json();
      if (data.result) setServerInfo(data.result);
    } catch (err) {
      console.error('Failed to load server info:', err);
    }
  };

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const body = JSON.parse(requestBody);
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setResponse(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleStream = () => {
    if (streaming) {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setStreaming(false);
      return;
    }

    setStreaming(true);
    setStreamMessages([]);
    const eventSource = new EventSource('/api/mcp?stream=true');
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStreamMessages((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${JSON.stringify(data, null, 2)}`,
        ]);
      } catch {
        setStreamMessages((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${event.data}`,
        ]);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      eventSourceRef.current = null;
      setStreaming(false);
    };
  };

  const insertExampleRequest = (method: string) => {
    const examples: Record<string, string> = {
      initialize: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "test-client", "version": "1.0.0" }
  }
}`,
      'tools/list': `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}`,
      'tools/call': `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "echo",
    "arguments": { "message": "Hello, MCP!" }
  }
}`,
      'resources/list': `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/list"
}`,
      ping: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "ping"
}`,
      get_available_countries: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_available_countries",
    "arguments": {}
  }
}`,
      get_channels: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_channels",
    "arguments": { "country": "DE" }
  }
}`,
      get_current_programmes: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_current_programmes",
    "arguments": { "country": "DE" }
  }
}`,
      search_programmes: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "search_programmes",
    "arguments": {
      "country": "DE",
      "query": "Nachrichten",
      "limit": 10
    }
  }
}`,
    };
    if (examples[method]) setRequestBody(examples[method]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader
        title="MCP Interface"
        subtitle="Model Context Protocol · HTTP & SSE"
        backHref="/de"
        wide
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="section-label mb-6">Entwickler</p>

        {serverInfo && (
          <div className="card mb-6 p-5">
            <div className="mb-4 flex items-center gap-2">
              <InformationCircleIcon className="h-5 w-5 text-emerald-500" />
              <h2 className="text-sm font-medium text-white">Server</h2>
            </div>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Name</dt>
                <dd className="mt-0.5 text-zinc-200">{serverInfo.server}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Version</dt>
                <dd className="mt-0.5 text-zinc-200">{serverInfo.version}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">POST</dt>
                <dd className="mt-0.5 font-mono text-xs text-emerald-400/90">
                  {serverInfo.endpoints.post}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Stream</dt>
                <dd className="mt-0.5 font-mono text-xs text-emerald-400/90">
                  {serverInfo.endpoints.stream}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-medium text-white">JSON-RPC Request</h2>

            <p className="mb-2 text-xs text-zinc-500">Basis</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {BASIC_EXAMPLES.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => insertExampleRequest(method)}
                  className="chip"
                >
                  {method}
                </button>
              ))}
            </div>

            <p className="mb-2 text-xs text-zinc-500">TV / EPG</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {TV_EXAMPLES.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => insertExampleRequest(method)}
                  className="chip"
                >
                  {method}
                </button>
              ))}
            </div>

            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="input-field h-56 resize-none"
              spellCheck={false}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRequest}
                disabled={loading}
                className="btn-primary"
              >
                <PlayIcon className="h-4 w-4" />
                {loading ? 'Sende…' : 'Senden'}
              </button>
              <button type="button" onClick={loadServerInfo} className="btn-secondary">
                <ArrowPathIcon className="h-4 w-4" />
                Aktualisieren
              </button>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="mb-4 text-sm font-medium text-white">Response</h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {response ? (
              <pre className="code-panel h-64">{JSON.stringify(response, null, 2)}</pre>
            ) : (
              <div className="code-panel flex h-64 items-center justify-center text-zinc-600">
                Antwort erscheint hier…
              </div>
            )}
          </div>
        </div>

        <div className="card mt-6 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-white">SSE Stream</h2>
            <button
              type="button"
              onClick={handleStream}
              className={streaming ? 'btn-danger' : 'btn-primary'}
            >
              {streaming ? (
                <>
                  <StopIcon className="h-4 w-4" />
                  Stoppen
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" />
                  Starten
                </>
              )}
            </button>
          </div>
          <pre className="code-panel h-48">
            {streamMessages.length === 0
              ? 'Stream-Nachrichten erscheinen hier…'
              : streamMessages.join('\n\n')}
          </pre>
        </div>

        {serverInfo && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="card p-5">
              <h2 className="mb-4 text-sm font-medium text-white">
                Tools ({serverInfo.tools.length})
              </h2>
              <ul className="max-h-80 space-y-2 overflow-y-auto">
                {serverInfo.tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2.5"
                  >
                    <p className="text-sm font-medium text-zinc-200">{tool.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{tool.description}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <h2 className="mb-4 text-sm font-medium text-white">
                Resources ({serverInfo.resources.length})
              </h2>
              <ul className="max-h-80 space-y-2 overflow-y-auto">
                {serverInfo.resources.map((resource) => (
                  <li
                    key={resource.uri}
                    className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2.5"
                  >
                    <p className="text-sm font-medium text-zinc-200">{resource.name}</p>
                    <p className="mt-1 break-all font-mono text-xs text-zinc-600">
                      {resource.uri}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-xs text-zinc-600">
          <Link href="/de" className="hover:text-zinc-400">
            ← Zurück zum EPG Service
          </Link>
        </p>
      </main>
    </div>
  );
}
