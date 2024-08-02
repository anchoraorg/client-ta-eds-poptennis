# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--client-ta-eds-poptennis--anchoraorg.hlx.page/
- Live: https://main--client-ta-eds-poptennis--anchoraorg.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## FAQ

- How Caching invalidation going to happen
  - Site so on deploy
  - Content on publish

## Add new Components

### AEM Based Authoring

- add component model to  `component-models.json`

```json
{
    "id": "teaser",
    "fields": [
      {
        "component": "reference",
        "valueType": "string",
        "name": "image",
        "label": "Background Image",
        "multi": false
      },
      {
        "component": "text",
        "name": "pretitle",
        "value": "",
        "label": "Pre Title",
        "valueType": "string"
      },
      {
        "component": "text",
        "name": "title",
        "value": "",
        "label": "Title",
        "valueType": "string"
      },
      {
        "component": "richtext",
        "name": "description",
        "value": "",
        "label": "Description",
        "valueType": "string"
      }
    ]
  }
```

- add new definition to `component-definition.json`

```json
{
          "title": "teaser",
          "id": "teaser",
          "plugins": {
            "xwalk": {
              "page": {
                "resourceType": "core/franklin/components/block/v1/block",
                "template": {
                  "name": "Teaser",
                  "model": "teaser"
                }
              }
            }
          }
        },

```

- update allowed components in `component-filters.json`

```json
  {
    "id": "section",
    "components": [
      "text",
      "image",
      "button",
      "title",
      "hero",
      "cards",
      "columns",
      "fragment",
      "teaser"
    ]
  },

```

### Alt Text for Images

When updating fields in `component-models.json` you can add suffix `Alt` to the name to define the component as image component.

```json
      {
        "component": "text",
        "name": "imageAlt",
        "value": "",
        "label": "Image Alt",
        "valueType": "string"
      },
```

### Field Type

When updating fields in `component-models.json` you can add suffix `Type` to define the type of the field.

```json
      {
        "component": "select",
        "name": "titleType",
        "value": "h3",
        "label": "Title Type",
        "valueType": "string",
        "options": [
          {
            "name": "h2",
            "value": "h2"
          },
          {
            "name": "h3",
            "value": "h3"
          },
          {
            "name": "h4",
            "value": "h4"
          }
        ]
      },
```

### Forgeround and Background

When creating fields in `component-models.json` you can add prefix `foreground_` and `background_` to the name to define the component as foreground or background component.

```json
      {
        "component": "text",
        "name": "background_imageAlt",
        "value": "",
        "label": "Image Alt",
        "valueType": "string"
      },
```

### Default values for Component Template

By default component template will have empty values for the fields, and it will be hard to find on the page. You can add default values for the fields in the component model.

When updating fields in `component-models.json` you can add `value` to define the default value for the field.

```json
      {
        "component": "text",
        "name": "title",
        "value": "Hello World",
        "label": "Title",
        "valueType": "string"
      },
```
