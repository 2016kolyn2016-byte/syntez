# Syntez.js

### Synchronizing Theses

Syntez is a lightweight, dependency-free framework for data-driven systems. It focuses on the controlled synthesis of application logic and the precise synchronization of internal state (theses) across defined host projections.

### Key Concepts

* **Unified Data Model:** Treats JS objects and primitive types as the primary building blocks for both logic and structure.
* **Declarative Definitions:** Define system states and projections using plain JavaScript object literals, where functions serve as reactive values.
* **Automatic Reactivity:** State and related entities remain in sync via a lightweight dependency tracking mechanism.
* **Minimal Footprint:** No virtual DOM, no build tools, no external dependencies. Pure JavaScript.

### Usage Guidelines

**Note:** Syntez is designed to be initialized **once**. The application structure and dynamics should be described using functions that react to data changes. Avoid calling `syntez()` repeatedly; instead, encapsulate your logic and state within the initial definition, allowing the framework to handle updates reactively.

### Data Projection and Mapping

To manage data flow, use these conventions:

* **Input/State:** Incoming data and external controls are defined via `syntez.<method>()`. These serve as your reactive state sources.
* **Output/Projection:** Target entities are defined within the `syntez(...)` call. The structure and naming of the keys define the hierarchy and map the objects onto specific host interfaces (e.g., DOM, console, or file systems).



### Live Example

The following snippet demonstrates how reactive functions act as the glue between data and the interface:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<script src="index.js"></script>
		<script>syntez({
			html() {
				var isDarkTheme = () => {
						var newPress = syntez.press();
						if (isDarkTheme.press !== newPress) {
							isDarkTheme.press = newPress;
							if (newPress && newPress === themeButton) isDarkTheme.val = !isDarkTheme.val
						}
						return isDarkTheme.val
					},
					themeButton = ['button', { class: 'theme-btn' }, () => isDarkTheme() ? '☀️ Light' : '🌙 Dark'];
				return {
					$: {
						lang: 'en',
						'data-theme': () => isDarkTheme() ? 'dark' : 'light'
					},
					head: [
						['meta', { charset: 'utf-8' }],
						['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
						['meta', { name: 'description', content: 'Universal Declarative Framework' }],
						['meta', { name: 'keywords', content: 'javascript, framework, reactive, json ml, declarative ui' }],
						['meta', { name: 'robots', content: 'index, follow' }],
						['link', { rel: 'canonical', href: 'https://syntez.js.org/' }],
						
						['title', 'Themed Unified Syntax | Syntez.js'],

						['meta', { property: 'og:type', content: 'website' }],
						['meta', { property: 'og:url', content: 'https://syntez.js.org/' }],
						['meta', { property: 'og:title', content: 'Themed Unified Syntax | Syntez.js' }],
						['meta', { property: 'og:description', content: 'Universal Declarative Framework' }],
						['meta', { property: 'og:image', content: 'https://syntez.js.org/assets/og-preview.png' }],

						['meta', { name: 'twitter:card', content: 'summary_large_image' }],
						['meta', { name: 'twitter:title', content: 'Themed Unified Syntax | Syntez.js' }],
						['meta', { name: 'twitter:image', content: 'https://syntez.js.org/assets/og-preview.png' }],

						['style', `
							html, html[data-theme="dark"] {
								--bg-main: #0a0a0c;
								--bg-surface: #131316;
								--border: #26262b;
								--text: #e4e4e7;
								--text-mute: #a1a1aa;
								--accent: #3b82f6;
								--shadow: rgba(0, 0, 0, 0.4);
								--glow-opacity: 0.15;
								--btn-bg: #ffffff;
								--btn-text: #09090b;
							}
							html[data-theme="light"] {
								--bg-main: #f4f4f5;
								--bg-surface: #ffffff;
								--border: #e4e4e7;
								--text: #09090b;
								--text-mute: #71717a;
								--accent: #2563eb;
								--shadow: rgba(0, 0, 0, 0.05);
								--glow-opacity: 0.08;
								--btn-bg: #131316;
								--btn-text: #e4e4e7;
							}
							* { box-sizing: border-box; }
							body { 
								font-family: system-ui, -apple-system, sans-serif; 
								background: var(--bg-main); 
								color: var(--text);
								margin: 0; 
								display: grid; 
								grid-template-rows: auto 1fr auto; 
								min-height: 100vh; 
								line-height: 1.5;
								transition: background 0.2s ease, color 0.2s ease;
							}
							.site-header {
								background: var(--bg-surface);
								border-bottom: 1px solid var(--border);
								padding: 1.25rem 2rem;
								display: flex;
								align-items: center;
							}
							.site-header h1 {
								font-size: 1.25rem;
								font-weight: 600;
								margin: 0;
								letter-spacing: -0.025em;
							}
							.theme-btn {
								margin-left: auto;
								background: var(--btn-bg);
								color: var(--btn-text);
								border: 1px solid var(--border);
								padding: 0.5rem 1rem;
								border-radius: 6px;
								cursor: pointer;
								font-weight: 500;
								font-size: 0.875rem;
								transition: background 0.2s, color 0.2s, border-color 0.2s;
							}
							.theme-btn:hover {
								border-color: var(--accent);
							}
							.layout-wrapper {
								display: grid;
								grid-template-columns: 1fr 300px;
								max-width: 1400px;
								width: 100%;
								margin: 0 auto;
								gap: 2rem;
								padding: 2rem;
							}
							@media (max-width: 900px) {
								.layout-wrapper { grid-template-columns: 1fr; }
							}
							.content-flow {
								display: flex;
								flex-direction: column;
								gap: 2rem;
							}
							.hero-section {
								background: linear-gradient(135deg, var(--bg-surface), var(--bg-main));
								border: 1px solid var(--border);
								border-radius: 12px;
								padding: 3rem 2.5rem;
								position: relative;
								overflow: hidden;
								box-shadow: 0 4px 24px -4px var(--shadow);
							}
							.hero-section::before {
								content: '';
								position: absolute;
								top: -50px; left: -50px;
								width: 150px; height: 150px;
								background: var(--accent);
								filter: blur(80px);
								opacity: var(--glow-opacity);
								pointer-events: none;
							}
							.hero-section h2 {
								font-size: 2.25rem;
								font-weight: 700;
								margin: 0 0 1rem 0;
								letter-spacing: -0.03em;
								background: linear-gradient(to right, var(--text), var(--text-mute));
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;
							}
							.hero-section p {
								color: var(--text-mute);
								font-size: 1.1rem;
								margin: 0;
								max-width: 600px;
							}
							.sidebar-panel {
								background: var(--bg-surface);
								border: 1px solid var(--border);
								border-radius: 12px;
								padding: 1.5rem;
								align-self: start;
							}
							.sidebar-panel h3 {
								font-size: 1rem;
								font-weight: 600;
								text-transform: uppercase;
								letter-spacing: 0.05em;
								color: var(--text-mute);
								margin: 0 0 1rem 0;
							}
							.page-footer {
								background: var(--bg-surface);
								border-top: 1px solid var(--border);
								padding: 1.5rem 2rem;
								text-align: center;
							}
							.page-footer p {
								margin: 0;
								font-size: 0.875rem;
								color: var(--text-mute);
							}
						`]
					],
					body: {
						header: {
							$: { tag: 'header', class: 'site-header' },
							logo: ['h1', 'Syntez'],
							themeToggle: themeButton
						},
						mainLayout: {
							$: { tag: 'div', class: 'layout-wrapper' },
							mainContent: {
								$: { tag: 'main', class: 'content-flow' },
								hero: {
									$: { tag: 'section', class: 'hero-section' },
									title: ['h2', 'Unified Polymorphic Syntax'],
									text: ['p', 'Direct arrays for simple nodes, objects for named tree branches.']
								}
							},
							sidebar: {
								$: { tag: 'aside', class: 'sidebar-panel' },
								widget: ['h3', 'Clean Tree']
							}
						},
						footer: {
							$: { tag: 'footer', class: 'page-footer' },
							copyright: () => `© ${syntez.year()} Syntez.js. All rights reserved.`
						}
					}
				}
			}
		})</script>
	</body>
</html>
