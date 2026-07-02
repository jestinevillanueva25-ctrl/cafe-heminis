# Cafe Heminis QR Menu

A mobile-friendly menu that can be shared via QR code.

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080/index.html

## Publish publicly

To make the QR work for customers on mobile data, host this folder on a public web host such as GitHub Pages.

### GitHub Pages

1. Create a new GitHub repository for this folder.
2. Push the contents to the repository's `main` branch.
3. In GitHub, open the repository's Settings > Pages.
4. Set the source to GitHub Actions.
5. The workflow in `.github/workflows/deploy-pages.yml` will publish the site automatically.

Once published, the QR will use the public URL automatically.
# Cafe-Gemini-s-Menu
# qr-menu
