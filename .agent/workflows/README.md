---
description: Migration Roadmap Overview - Shadcn/UI Migration Plan
---

# 🚀 Migration Roadmap: Material Tailwind → Shadcn/UI

## 📋 Overview

Kế hoạch migration toàn bộ ứng dụng Supply Chain Management từ Material Tailwind sang Shadcn/UI trong 14 tuần.

**Mục tiêu:**

- ✨ UI/UX hiện đại hơn với Shadcn/UI
- 🎨 Dark mode support
- ⚡ Performance tốt hơn với React Query
- 🔒 Type-safe forms với Zod
- ♿ Accessibility compliant
- 🧪 Better testing coverage

---

## 📅 Timeline

| Phase   | Duration   | Focus                   | Status         |
| ------- | ---------- | ----------------------- | -------------- |
| Phase 1 | Week 1-2   | Setup & Core Components | 🔲 Not Started |
| Phase 2 | Week 3-4   | Common Components       | 🔲 Not Started |
| Phase 3 | Week 5-6   | Product Module          | 🔲 Not Started |
| Phase 4 | Week 7-8   | Manufacturing Module    | 🔲 Not Started |
| Phase 5 | Week 9-10  | Inventory Module        | 🔲 Not Started |
| Phase 6 | Week 11-12 | Purchasing & Sales      | 🔲 Not Started |
| Phase 7 | Week 13-14 | Polish & Optimization   | 🔲 Not Started |

---

## 🎯 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Start Migration

1. **Phase 1: Setup**

   ```bash
   # View detailed workflow
   cat .agent/workflows/phase-1-setup.md

   # Or use slash command
   /phase-1-setup
   ```

2. **Follow each phase sequentially**
   - Complete all tasks in current phase
   - Test thoroughly
   - Move to next phase

---

## 📚 Workflows

Access detailed workflows using slash commands:

- `/phase-1-setup` - Setup & Core Components
- `/phase-2-common-components` - Migrate Common Components
- `/phase-3-product-module` - Migrate Product Module
- `/phase-4-7-complete` - Complete Migration & Polish

---

## 🛠️ Tech Stack

### Current

- React 18
- Material Tailwind
- Material-UI (MUI)
- Axios
- React Router v6

### Target

- React 18 ✅
- **Shadcn/UI** (new)
- **TanStack Table** (new)
- **React Hook Form + Zod** (new)
- **React Query** (new)
- **Sonner Toast** (new)
- **Framer Motion** (new)
- Axios ✅
- React Router v6 ✅

---

## 📦 New Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",
    "@tanstack/react-table": "^8.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x",
    "sonner": "^1.x",
    "framer-motion": "^11.x",
    "next-themes": "^0.2.x",
    "qrcode.react": "^3.x",
    "react-qr-scanner": "^1.x",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "vitest": "^1.x",
    "@axe-core/react": "^4.x"
  }
}
```

---

## 🎨 Design System

### Colors

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
      },
    },
  },
};
```

### Typography

- Font: Inter
- Headings: Bold, clear hierarchy
- Body: Regular, readable line-height

### Spacing

- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

---

## 📊 Migration Progress

### Phase 1: Setup & Core Components

- [ ] Install Shadcn/UI
- [ ] Setup React Hook Form + Zod
- [ ] Create base form components
- [ ] Setup Sonner toast
- [ ] Setup React Query

### Phase 2: Common Components

- [ ] DataTable → TanStack Table
- [ ] StatusSummaryCard → Card + Badge
- [ ] SelectAutocomplete → Command
- [ ] ConfirmDialog → AlertDialog
- [ ] LoadingPaper → Skeleton

### Phase 3: Product Module

- [ ] AllProducts page
- [ ] ProductDetail page
- [ ] ScanQR page
- [ ] ProductQRModal
- [ ] QRScannerModal

### Phase 4: Manufacturing Module

- [ ] MoInCompany
- [ ] MoDetail
- [ ] MoForm
- [ ] BomInCompany
- [ ] BomDetail
- [ ] ProcessCard

### Phase 5: Inventory Module

- [ ] Inventory page
- [ ] ReceiveTicket pages
- [ ] IssueTicket pages
- [ ] TransferTicket pages

### Phase 6: Purchasing & Sales

- [ ] Purchasing module (5 pages)
- [ ] Sales module (5 pages)
- [ ] Delivery module (3 pages)

### Phase 7: Polish & Optimization

- [ ] Animations with Framer Motion
- [ ] Dark mode implementation
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Testing

---

## 🧪 Testing Strategy

### Unit Tests

- All UI components
- Utility functions
- Custom hooks

### Integration Tests

- Page components
- Form submissions
- API interactions

### E2E Tests

- Critical user flows
- Authentication
- CRUD operations

### Target Coverage

- Overall: 80%+
- Critical paths: 90%+

---

## 📈 Success Metrics

### Performance

- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle Size: < 500KB (gzipped)

### Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation: 100%
- Screen reader compatible
- Color contrast: AAA where possible

### Code Quality

- ESLint: 0 errors
- TypeScript: 0 errors (if migrating)
- Test coverage: 80%+
- No console errors

---

## 🚨 Common Issues & Solutions

### Issue 1: Styling conflicts

**Solution:** Remove Material Tailwind imports gradually, test each page

### Issue 2: Form validation

**Solution:** Use Zod schemas, test all edge cases

### Issue 3: Table performance

**Solution:** Use virtualization for large datasets, implement pagination

### Issue 4: Dark mode flashing

**Solution:** Use next-themes with proper SSR handling

---

## 📝 Notes

### Breaking Changes

- Material Tailwind components completely removed
- Form structure changed (React Hook Form)
- Toast API changed (Sonner)
- Table API changed (TanStack Table)

### Migration Tips

1. **Work incrementally** - One module at a time
2. **Test thoroughly** - Don't skip testing
3. **Keep old code** - Use git branches
4. **Document changes** - Update README
5. **Get feedback** - Test with users

---

## 🤝 Team Coordination

### Roles

- **Frontend Lead**: Oversee migration
- **Developers**: Implement changes
- **QA**: Test each phase
- **Designer**: Verify UI/UX

### Communication

- Daily standups
- Weekly demos
- Slack channel for issues
- Documentation in Notion/Confluence

---

## 📖 Resources

### Documentation

- [Shadcn/UI Docs](https://ui.shadcn.com)
- [TanStack Table](https://tanstack.com/table)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [React Query](https://tanstack.com/query)

### Examples

- [Shadcn Examples](https://ui.shadcn.com/examples)
- [TanStack Table Examples](https://tanstack.com/table/latest/docs/examples/react/basic)

---

## 🎉 Completion Criteria

Migration is complete when:

- ✅ All Material Tailwind removed
- ✅ All pages using Shadcn/UI
- ✅ Dark mode working
- ✅ All tests passing
- ✅ Performance metrics met
- ✅ Accessibility audit passed
- ✅ Documentation updated
- ✅ Deployed to production

---

## 🔄 Next Steps

1. Review this roadmap with team
2. Set up project board (Jira/Trello)
3. Assign tasks for Phase 1
4. Start with `/phase-1-setup`
5. Track progress weekly

**Good luck with the migration! 🚀**
