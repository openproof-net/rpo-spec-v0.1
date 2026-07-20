# OpenProof Legal Evidence Lab — backend boundary

This directory is the deployable backend boundary for the public browser MVP. It is intentionally separate from the static `docs/` interface and from the private TruthX runtime.

## What it does

- accepts bounded multipart uploads (`txt`, `md`, `json`, `csv`, `xml`, images and optional PDFs);
- creates a short-lived job and processes it through a bounded in-memory queue;
- hashes each submitted source and emits an RPO v0.1 core plus a separate analysis ledger;
- keeps exploratory signals and uncertainty outside the RPO core;
- removes uploaded source material after artifact creation;
- purges completed or failed jobs after the configured retention period;
- exposes an explicit, disabled-by-default TruthX integration boundary.

## Local run

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -e '.[test,ocr]'
PYTHONPATH=src pytest
openproof-legal-api
```

The API listens on `127.0.0.1:8000` by default. A production deployment must place it behind TLS, authentication/rate limiting, a persistent queue, an isolated worker pool and an external object store with an explicit deletion policy. The in-memory queue is a runnable MVP boundary, not a production availability guarantee.

## API flow

1. `POST /v1/jobs` with one or more files and an optional context note.
2. Poll `GET /v1/jobs/{job_id}`.
3. Read `GET /v1/jobs/{job_id}/rpo` and `/ledger` after completion.
4. Delete explicitly with `DELETE /v1/jobs/{job_id}`; automatic retention cleanup also runs.

The service does not make legal findings, identify a perpetrator, render a judgment or provide legal advice. Do not submit real personal data to a local development instance without an appropriate privacy and legal framework.
