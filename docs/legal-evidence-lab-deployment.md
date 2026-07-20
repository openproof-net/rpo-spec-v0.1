# OpenProof Legal Evidence Lab — public target

The intended public hostname for the advanced simulator is:

`legal.openproof.net`

The current RPO repository contains the public static boundary and a stable route at:

`docs/legal/index.html`

The route is deliberately static and safe to publish before the secured backend is connected. It provides the browser-local simulator, multi-document text intake, visible pipeline trace, benchmark calibration panel and RPO v0.1 export.

The full backend boundary is now documented in `backend/`. It accepts bounded uploads, queues short-lived jobs, extracts text where optional dependencies are installed, emits an RPO plus a separate analysis ledger, removes source files after artifact creation and purges expired jobs. No secret, model credential or private runtime is stored in this repository.

The included queue is a runnable MVP boundary. Before public production use, it still needs TLS, authentication, rate limiting, durable queueing, isolated workers, observability, a tested retention policy and a private TruthX adapter. The browser route remains safe to publish without enabling this backend.
