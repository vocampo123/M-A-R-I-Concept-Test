# App Builder Layout Rules

Use these rules for any page that will be deployed to Salesforce Lightning App Builder.

## Core Principle

Every visible page section should be its own deployable wrapper LWC. The page template or FlexiPage owns cross-region layout. Section LWCs own only their internal content.

This keeps pages editable in App Builder and prevents hidden coupling between columns.

## Good Pattern

Use one exposed LWC per independently configurable region:

- `membershipCommandCenterAlerts`
- `membershipCommandCenterHeader`
- `membershipCommandCenterPrimary`
- `membershipCommandCenterWatchlist`

Use a custom App Page template when regions need specific row and column alignment:

```xml
<flexipage:region name="alerts" defaultWidth="SMALL" />
<flexipage:region name="header" defaultWidth="LARGE" />
<flexipage:region name="primaryContent" defaultWidth="LARGE" />
<flexipage:region name="watchlist" defaultWidth="MEDIUM" />
```

In the template CSS, use an explicit grid for deterministic placement:

```css
.THIS.mcc-template {
    display: grid;
    gap: var(--slds-g-spacing-4, 1rem);
    grid-template-columns: minmax(0, 2fr) minmax(0, 7fr) minmax(0, 3fr);
    grid-template-rows: auto auto;
}

.THIS .mcc-template__alerts {
    grid-column: 1;
    grid-row: 1 / span 2;
}

.THIS .mcc-template__header {
    grid-column: 2 / span 2;
    grid-row: 1;
}

.THIS .mcc-template__primary {
    grid-column: 2;
    grid-row: 2;
}

.THIS .mcc-template__watchlist {
    grid-column: 3;
    grid-row: 2;
}
```

Mirror the same composition in the local prototype route wrapper under `src/modules/page/<name>/` so local and deployed experiences stay aligned.

## Bad Pattern

Do not solve cross-region alignment inside a child LWC.

Avoid:

- A single mega wrapper LWC that owns the entire App Builder page.
- `padding-top` or `margin-top` inside one section LWC to align with a component in another region.
- Builder properties like `topOffsetRem` whose only purpose is compensating for another column's content height.
- Empty spacer markup inside a component to align with another App Builder region.
- Nested `lightning:layout` in custom App Page templates when precise row alignment matters.

## When Alignment Is Wrong

If a right rail, alert rail, header, or content card is not aligned:

1. Check the FlexiPage regions and template first.
2. Verify that the regions that should align are in the same template grid row.
3. Move content into separate wrapper LWCs if a component contains multiple independently placed sections.
4. Fix the custom App Page template CSS.
5. Only tune child component spacing for internal content rhythm, never for cross-region alignment.

## App Builder Compatibility

Salesforce may block removing a region from a custom template or removing an exposed property from an LWC when that template/component is already used on a Lightning page. If a deployed template shape needs to change, create a new template with a new component name and update the FlexiPage to use it. Keep deprecated LWC properties as no-op properties until the component is no longer used on active Lightning pages.
