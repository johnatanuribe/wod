# UI Coding Standards

## Core Principle

**This project uses ONLY shadcn UI components for all user interface elements.**

## Component Usage Rules

### ✅ REQUIRED: Use shadcn UI Components

All UI components in this project MUST be from [shadcn/ui](https://ui.shadcn.com/).

- Browse available components: https://ui.shadcn.com/docs/components
- Install components using the CLI: `npx shadcn@latest add [component-name]`
- Use the installed components directly in your code

### ❌ PROHIBITED: Custom Components

**Absolutely NO custom components should be created.**

This includes:
- Custom buttons, inputs, modals, or any UI elements
- Wrapper components around HTML elements for styling
- Custom implementations of common UI patterns
- "Utility" or "helper" components that render UI

### When You Need a UI Component

1. **Check shadcn/ui first**: Visit https://ui.shadcn.com/docs/components/accordion to see all available components
2. **Install the component**: Run `npx shadcn@latest add [component-name]`
3. **Use it directly**: Import and use the shadcn component in your code

### Example: Adding a Button

```bash
# Install the button component
npx shadcn@latest add button
```

```tsx
// Use it in your code
import { Button } from "@/components/ui/button"

export default function MyPage() {
  return <Button>Click me</Button>
}
```

## shadcn/ui Setup

### Installation

If shadcn/ui is not yet set up in this project:

```bash
npx shadcn@latest init
```

Follow the prompts to configure:
- TypeScript: Yes
- Style: Default or as per project preference
- Base color: Slate (or as per project preference)
- CSS variables: Yes

### Component Installation

Install components as needed:

```bash
# Install a single component
npx shadcn@latest add button

# Install multiple components
npx shadcn@latest add button card dialog

# Install all components (not recommended, only install what you need)
npx shadcn@latest add --all
```

## Available Component Categories

shadcn/ui provides components for:

- **Layout**: Aspect Ratio, Separator, Scroll Area
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination, Tabs
- **Forms**: Button, Calendar, Checkbox, Command, Combobox, Date Picker, Form, Input, Label, Popover, Radio Group, Select, Slider, Switch, Textarea, Toggle
- **Data Display**: Avatar, Badge, Card, Carousel, Chart, Collapsible, Data Table, Drawer, Hover Card, Progress, Skeleton, Table, Toast, Tooltip
- **Feedback**: Alert, Alert Dialog, Dialog, Sonner, Toast
- **Other**: Accordion, Context Menu, Dropdown Menu, Resizable, Sheet, Sidebar

## Customization

shadcn components are installed into your project's `components/ui` directory and can be customized by:

1. **Modifying the installed component files** in `components/ui/` (they're yours to modify)
2. **Using className prop** to apply Tailwind classes
3. **Updating the theme** in `globals.css` for project-wide styling

```tsx
// Example: Customizing with className
<Button className="bg-blue-500 hover:bg-blue-600">
  Custom Styled Button
</Button>
```

## Date Formatting

**All date formatting MUST be done using [date-fns](https://date-fns.org/).**

### Standard Date Format

Dates should be formatted consistently across the entire application using the following format:

- 1st Sep 2025
- 2nd Aug 2025
- 3rd Jan 2026
- 4th Jun 2024

### Installation

```bash
npm install date-fns
```

### Usage

```tsx
import { format } from 'date-fns'

// Format a date
const date = new Date('2025-09-01')
const formattedDate = format(date, 'do MMM yyyy')
// Output: "1st Sep 2025"
```

### Format String

The standard format string for this project is: **`'do MMM yyyy'`**

- `do` - Day of month with ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
- `MMM` - Abbreviated month name (Jan, Feb, Mar, etc.)
- `yyyy` - Full year (2025, 2026, etc.)

### Examples

```tsx
import { format } from 'date-fns'

// Various examples
format(new Date('2025-01-01'), 'do MMM yyyy') // "1st Jan 2025"
format(new Date('2024-06-04'), 'do MMM yyyy') // "4th Jun 2024"
format(new Date('2025-08-02'), 'do MMM yyyy') // "2nd Aug 2025"
format(new Date('2026-01-03'), 'do MMM yyyy') // "3rd Jan 2026"
```

### Rules

- Always use `date-fns` for date formatting
- Always use the format string `'do MMM yyyy'` unless there's a specific documented exception
- Do not use native JavaScript date methods for formatting
- Do not use other date libraries (e.g., moment.js, dayjs)

## Project Structure

```
components/
  ui/                  # shadcn UI components live here
    button.tsx
    card.tsx
    dialog.tsx
    ...
```

## When shadcn Doesn't Have What You Need

If shadcn/ui doesn't have a specific component you need:

1. **Check if it can be built from existing shadcn components** (e.g., a card with a button)
2. **Look for shadcn examples** that combine components
3. **Consult with the team** before considering any exceptions to this rule

## Enforcement

This is a strict rule. Code reviews will reject:
- Any custom UI components
- Any styled HTML elements being used as reusable components
- Any abstraction layers around basic HTML that serve UI purposes

## Questions?

- shadcn/ui Documentation: https://ui.shadcn.com
- Components Gallery: https://ui.shadcn.com/docs/components
- Examples: https://ui.shadcn.com/examples
