/**
 * Single source of truth for app routes.
 * Consumed by router.js (matching, titles) and app (nav maps, nav items).
 *
 * Fields:
 *   path       - URL pattern (use :param for dynamic segments)
 *   component  - LWC component name (must be registered in app.js ROUTE_COMPONENTS)
 *   title      - Document title (string or (params) => string)
 *   navPage    - Id for nav active state and navigate({ page }) (omit to hide from nav)
 *   navLabel   - Label shown in nav bar and waffle
 *   navPath    - Optional; for dynamic routes, path used in nav links (e.g. /users/42)
 *   navHighlight - Optional; nav page id to highlight when this route is active (for child routes that don't create a tab)
 */

// When building a new demo, replace these routes — do not add alongside them.
// See CLAUDE.md "Adding a new page" for the correct approach.
export const routes = [
  {
    path: '/',
    component: 'page-membership-center',
    title: 'Membership Center',
    navPage: 'membership-center',
    navLabel: 'Membership Center',
  },
  {
    path: '/membership-setup',
    component: 'page-membership-setup',
    title: 'Membership Setup',
    navPage: 'membership-setup',
    navLabel: 'Membership Setup',
  },
  {
    path: '/members',
    component: 'page-members-list',
    title: 'Members',
    navPage: 'members',
    navLabel: 'Members',
  },
  {
    path: '/members/:id',
    component: 'page-member-detail',
    title: (params) => `Member ${params.id}`,
    navHighlight: 'members',
  },
  {
    path: '/member-detail',
    component: 'page-loyalty-member-detail',
    title: 'Member Detail',
    navPage: 'member-detail',
    navLabel: 'Member Detail',
  },
  {
    path: '/member-detail/:id',
    component: 'page-loyalty-member-detail',
    title: (params) => `Member ${params.id}`,
    navHighlight: 'member-detail',
  },
];
