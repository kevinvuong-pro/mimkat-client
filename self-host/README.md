# Mimkat Client self-hosting

This deployment is separate from local development. It builds a standalone
Next.js image and publishes the app through the shared Traefik `proxy` network.

```bash
docker network create proxy
cp self-host/.env.example self-host/.env.production
# Edit self-host/.env.production
docker compose --env-file self-host/.env.production \
  -f self-host/compose.yml up -d --build
```

Create a Cloudflare DNS record for `APP_HOST` pointing to the VPS. Set
`TRAEFIK_CERTRESOLVER` to the exact resolver name configured in Traefik
(usually `letsencrypt`). In Coolify, use `self-host/compose.yml` as a separate
Compose resource and add the template variables as build/environment variables;
no `.env.production` file is required. `NEXT_PUBLIC_API_URL` must be set before
the image is built because Next.js embeds public variables in the client bundle.

For Cloudflare Origin Certificates, install the certificate and key in
Traefik's static/dynamic configuration and remove the `tls.certresolver` label
from this Compose file. Keep `tls=true` enabled.
