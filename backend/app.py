"""Minimal stdlib HTTP API over RunService — no web-framework dependency.

Endpoints:
    POST /runs        body: {goal, target, backend?, step_budget?, authorized_targets?}
                      -> 201 {"id": "..."}
    GET  /runs/{id}   -> 200 <Run JSON> | 404

Run it: ``python -m backend.app`` (binds 127.0.0.1:8800).
"""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Any

from ai_framework.agent.contracts import RunConfig
from backend.service import RunService


def make_handler(service: RunService) -> type[BaseHTTPRequestHandler]:
    class Handler(BaseHTTPRequestHandler):
        def _send(self, code: int, payload: dict[str, Any] | str) -> None:
            body = (payload if isinstance(payload, str) else json.dumps(payload)).encode()
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_POST(self) -> None:  # noqa: N802 - http.server API
            if self.path != "/runs":
                return self._send(404, {"error": "not found"})
            length = int(self.headers.get("Content-Length", 0))
            try:
                data = json.loads(self.rfile.read(length) or b"{}")
                config = RunConfig.model_validate(data)
            except Exception as exc:  # noqa: BLE001 - report bad input as 400
                return self._send(400, {"error": str(exc)})
            run_id = service.start_run(config)
            self._send(201, {"id": run_id})

        def do_GET(self) -> None:  # noqa: N802 - http.server API
            if not self.path.startswith("/runs/"):
                return self._send(404, {"error": "not found"})
            run = service.get_run(self.path.removeprefix("/runs/"))
            if run is None:
                return self._send(404, {"error": "unknown run id"})
            self._send(200, run.model_dump_json())

        def log_message(self, *args: object) -> None:
            pass

    return Handler


def main() -> None:
    service = RunService()
    server = HTTPServer(("127.0.0.1", 8800), make_handler(service))
    print("SecForge API on http://127.0.0.1:8800  (POST /runs, GET /runs/{id})")
    server.serve_forever()


if __name__ == "__main__":
    main()
