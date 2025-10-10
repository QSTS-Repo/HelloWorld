# QSTS Tools static site

This `docs/` folder contains a small static website for the QSTS research team. It's designed to be published using GitHub Pages with zero server cost.

How to publish

- Push this repository to GitHub.
- In your repository settings -> Pages, select the `docs/` folder on the `main` branch as the publishing source.
- After a few minutes your site will be available at `https://<your-org-or-username>.github.io/<repo>/`.

Preview locally

You can preview the site locally with a tiny static server. From the project root run:

```bash
python3 -m http.server 8000 --directory docs
```

Then open http://localhost:8000 in your browser.

Customization

- Edit `data/team.json` to update team information, members and tools.
- Replace the SVG files in `docs/assets/` with your logos and images.
- Styles are in `docs/assets/style.css` and behavior is in `docs/assets/script.js`.
