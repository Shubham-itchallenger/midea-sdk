# Submission checklist

After pushing this repository to GitHub:

1. Import it into Vercel, keep the repository root as the project root, and set `VITE_PEXELS_API_KEY` in Vercel’s environment variables. The included `vercel.json` builds and publishes `apps/web/dist`.
2. In GitHub repository settings, enable **Pages** with **GitHub Actions** as the source. Push to `main` (or run the “Deploy documentation” workflow) to publish this `docs` directory. The SDK reference will be `/sdk/` and components reference `/components/` beneath the Pages URL.
3. Replace the placeholders below with the resulting public URLs and the shared AI conversation URLs. Those links require the repository owner’s GitHub/Vercel/AI account and cannot be created from local source code.

```text
Repository: https://github.com/<owner>/<repo>
Live app: https://<project>.vercel.app
SDK docs: https://<owner>.github.io/<repo>/sdk/
Component docs: https://<owner>.github.io/<repo>/components/
AI discussion 1: <shared-chat-url>
AI discussion 2: <shared-chat-url>
```
