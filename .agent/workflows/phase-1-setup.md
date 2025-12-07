---
description: Phase 1 - Setup & Core Components (Week 1-2)
---

# Phase 1: Setup & Core Components

## Mục tiêu

Thiết lập foundation cho việc migration sang Shadcn/UI với các tools và components cơ bản.

---

## Step 1: Install Shadcn/UI

### 1.1 Install dependencies

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot
```

### 1.2 Initialize Shadcn/UI

```bash
npx shadcn-ui@latest init
```

**Chọn options:**

- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: Yes

### 1.3 Verify installation

- Check `components.json` được tạo
- Check `lib/utils.ts` có function `cn()`
- Check `tailwind.config.js` updated

---

## Step 2: Setup React Hook Form + Zod

### 2.1 Install packages

```bash
npm install react-hook-form @hookform/resolvers zod
```

### 2.2 Create form utilities

**File: `src/lib/form-utils.js`**

```javascript
import { z } from "zod";

// Common validation schemas
export const emailSchema = z.string().email("Email không hợp lệ");
export const passwordSchema = z
  .string()
  .min(6, "Mật khẩu phải có ít nhất 6 ký tự");
export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ");

// Helper to create form schema
export const createFormSchema = (fields) => z.object(fields);
```

---

## Step 3: Create Base Form Components

### 3.1 Install Shadcn form components

```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
```

### 3.2 Create FormInput wrapper

**File: `src/components/ui/form-input.jsx`**

```javascript
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function FormInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
  ...props
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### 3.3 Create FormSelect wrapper

**File: `src/components/ui/form-select.jsx`**

```javascript
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FormSelect({
  control,
  name,
  label,
  placeholder,
  options,
  ...props
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### 3.4 Create FormCheckbox wrapper

**File: `src/components/ui/form-checkbox.jsx`**

### 3.5 Create FormDatePicker wrapper

**File: `src/components/ui/form-datepicker.jsx`**

### 3.6 Create FormTextarea wrapper

**File: `src/components/ui/form-textarea.jsx`**

---

## Step 4: Setup Sonner Toast

### 4.1 Install Sonner

```bash
npx shadcn-ui@latest add sonner
```

### 4.2 Add Toaster to App

**File: `src/App.js`**

```javascript
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}
```

### 4.3 Create toast service wrapper

**File: `src/services/toastService.js`**

```javascript
import { toast } from "sonner";

export const toastService = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),
};
```

### 4.4 Replace old toastr

- Find all `toastrService` imports
- Replace with new `toastService`
- Test notifications

---

## Step 5: Setup React Query

### 5.1 Install React Query

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 5.2 Setup QueryClient

**File: `src/config/queryClient.js`**

```javascript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### 5.3 Wrap App with QueryClientProvider

**File: `src/index.js`**

```javascript
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./config/queryClient";

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### 5.4 Create custom hooks

**File: `src/hooks/useItems.js`** (example)

```javascript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllItemsInCompany,
  createItem,
  updateItem,
  deleteItem,
} from "@/services/general/ItemService";

export function useItems(companyId) {
  return useQuery({
    queryKey: ["items", companyId],
    queryFn: () =>
      getAllItemsInCompany(companyId, localStorage.getItem("token")),
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
```

---

## Checklist

- [ ] Shadcn/UI installed and configured
- [ ] React Hook Form + Zod installed
- [ ] All base form components created
- [ ] Sonner toast setup and tested
- [ ] React Query setup with QueryClient
- [ ] DevTools working in development
- [ ] Example custom hook created
- [ ] Old toastr replaced with Sonner

---

## Testing

1. Test form validation với Zod
2. Test toast notifications
3. Test React Query caching
4. Check DevTools hoạt động
5. Verify no console errors

---

## Next Phase

👉 **Phase 2: Migrate Common Components**
