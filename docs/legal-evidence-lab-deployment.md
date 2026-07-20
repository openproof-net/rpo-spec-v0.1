# OpenProof Legal Evidence Lab — public target

The intended public hostname for the advanced simulator is:

`legal.openproof.net`

The current RPO repository contains the public static boundary and a stable route at:

`docs/legal/index.html`

The route is deliberately static and safe to publish before the secured backend is connected. It provides the browser-local simulator, multi-document text intake, visible pipeline trace, benchmark calibration panel and RPO v0.1 export.

The full backend remains a separate deployment layer for PDF/OCR extraction, queued jobs, isolated processing, automatic deletion and TruthX Engine execution. No secret, model credential or private runtime is stored in this repository.
