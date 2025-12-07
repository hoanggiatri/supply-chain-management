---
description: Phase 4-7 - Complete Migration & Polish
---

# Phase 4-7: Complete Migration & Polish

## Phase 4: Manufacturing Module (Week 7-8)

### Components to migrate:

1. **MoInCompany** - Manufacturing Orders list
2. **MoDetail** - MO detail with stages
3. **MoForm** - Create/Edit MO with React Hook Form
4. **BomInCompany** - Bill of Materials list
5. **BomDetail** - BOM detail with components
6. **ProcessCard** - Visual process timeline

### Key features:

- Timeline component for manufacturing stages
- Progress indicators
- Status badges for each stage
- Form validation with Zod

---

## Phase 5: Inventory Module (Week 9-10)

### Components to migrate:

1. **Inventory** - Stock overview with charts
2. **ReceiveTicket** pages - Receiving process
3. **IssueTicket** pages - Issue process
4. **TransferTicket** pages - Transfer between warehouses

### Key features:

- Stock level indicators
- Low stock alerts
- Batch selection
- Multi-step forms

---

## Phase 6: Purchasing & Sales (Week 11-12)

### Purchasing Module:

1. **SupplierSearch** - Search with filters
2. **RfqInCompany** - RFQ list
3. **QuotationInCustomerCompany** - Quotations
4. **PoInCompany** - Purchase Orders
5. **PurchaseReport** - Analytics dashboard

### Sales Module:

1. **RfqInSupplierCompany** - Incoming RFQs
2. **QuotationInCompany** - Quotations sent
3. **PoInSupplierCompany** - Incoming POs
4. **SoInCompany** - Sales Orders
5. **SalesReport** - Sales analytics

### Delivery Module:

1. **DoInCompany** - Delivery Orders
2. **DoDetail** - Delivery tracking
3. **DoProcess** - Delivery status updates

---

## Phase 7: Polish & Optimization (Week 13-14)

### 1. Animations with Framer Motion

#### Install Framer Motion

```bash
npm install framer-motion
```

#### Create animation variants

**File: `src/lib/animations.js`**

```javascript
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { duration: 0.2 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.2 },
};
```

#### Apply to pages

```javascript
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function MyPage() {
  return <motion.div {...fadeIn}>{/* Page content */}</motion.div>;
}
```

---

### 2. Dark Mode Implementation

#### Install next-themes

```bash
npm install next-themes
```

#### Setup theme provider

**File: `src/components/theme-provider.jsx`**

```javascript
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

#### Wrap App

```javascript
import { ThemeProvider } from "@/components/theme-provider";

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>;
```

#### Add theme toggle

```bash
npx shadcn-ui@latest add dropdown-menu
```

**File: `src/components/theme-toggle.jsx`**

```javascript
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### 3. Performance Optimization

#### Code splitting

```javascript
import { lazy, Suspense } from "react";
import { TableSkeleton } from "@/components/ui/loading-skeleton";

const AllProducts = lazy(() => import("@/pages/general/product/AllProducts"));

function App() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <AllProducts />
    </Suspense>
  );
}
```

#### React Query optimization

```javascript
// Prefetch data
queryClient.prefetchQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

// Optimistic updates
const mutation = useMutation({
  mutationFn: updateProduct,
  onMutate: async (newProduct) => {
    await queryClient.cancelQueries({ queryKey: ["products"] });
    const previousProducts = queryClient.getQueryData(["products"]);
    queryClient.setQueryData(["products"], (old) => [...old, newProduct]);
    return { previousProducts };
  },
  onError: (err, newProduct, context) => {
    queryClient.setQueryData(["products"], context.previousProducts);
  },
});
```

#### Memoization

```javascript
import { useMemo, useCallback } from "react";

const columns = useMemo(() => [...], []);
const handleClick = useCallback(() => {...}, [dependency]);
```

---

### 4. Accessibility Audit

#### Install accessibility tools

```bash
npm install -D @axe-core/react
```

#### Add to development

```javascript
if (process.env.NODE_ENV !== "production") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

#### Checklist:

- [ ] All interactive elements keyboard accessible
- [ ] Proper ARIA labels
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested
- [ ] Form validation accessible

---

### 5. Testing

#### Install testing libraries

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest
```

#### Example test

**File: `src/components/ui/__tests__/button.test.jsx`**

```javascript
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText("Click me").click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

---

## Final Checklist

### Design

- [ ] Consistent color scheme applied
- [ ] Typography hierarchy clear
- [ ] Spacing consistent (4px base)
- [ ] Responsive on all breakpoints
- [ ] Dark mode fully implemented

### Animations

- [ ] Page transitions smooth
- [ ] Modal animations polished
- [ ] Button hover effects
- [ ] Loading states animated
- [ ] Skeleton loaders in place

### Performance

- [ ] Code splitting implemented
- [ ] React Query optimized
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Lighthouse score > 90

### Accessibility

- [ ] Keyboard navigation works
- [ ] ARIA labels correct
- [ ] Focus indicators visible
- [ ] Color contrast WCAG AA
- [ ] Screen reader friendly

### Testing

- [ ] Unit tests for components
- [ ] Integration tests for pages
- [ ] E2E tests for critical flows
- [ ] Test coverage > 80%

---

## Deployment

### Build for production

```bash
npm run build
```

### Verify build

```bash
npm run preview
```

### Deploy

- Vercel / Netlify for frontend
- Check environment variables
- Test production build
- Monitor performance

---

## Documentation

### Update README

- Installation instructions
- Development setup
- Component usage
- API documentation
- Deployment guide

### Create Storybook (optional)

```bash
npx storybook@latest init
```

---

## Success Metrics

- ✅ All Material Tailwind removed
- ✅ All components using Shadcn/UI
- ✅ Dark mode working
- ✅ Animations smooth
- ✅ Performance improved
- ✅ Accessibility compliant
- ✅ Tests passing
- ✅ Documentation complete

🎉 **Migration Complete!**
