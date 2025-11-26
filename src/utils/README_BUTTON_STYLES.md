# Button Styles Guide

Hệ thống button colors đã được tạo sẵn trong `buttonStyles.js` để dễ dàng sử dụng và maintain.

## Import

```javascript
import { getButtonProps, BUTTON_COLORS } from "@/utils/buttonStyles";
import { Button } from "@material-tailwind/react";
```

## Cách sử dụng

### Cách 1: Sử dụng `getButtonProps()` (Recommended)

```javascript
<Button {...getButtonProps("primary")}>Submit</Button>
<Button {...getButtonProps("secondary")}>Cancel</Button>
<Button {...getButtonProps("danger")}>Delete</Button>
```

### Cách 2: Sử dụng trực tiếp `BUTTON_COLORS`

```javascript
<Button {...BUTTON_COLORS.primary}>Submit</Button>
<Button {...BUTTON_COLORS.secondary}>Cancel</Button>
```

### Cách 3: Thêm custom className

```javascript
<Button {...getButtonProps("primary", "mt-4")}>Submit</Button>
<Button {...getButtonProps("secondary", "w-32")}>Cancel</Button>
```

## Các loại Button có sẵn

### 1. **Primary** - Hành động chính
```javascript
<Button {...getButtonProps("primary")}>Đăng nhập</Button>
<Button {...getButtonProps("primary")}>Lưu</Button>
<Button {...getButtonProps("primary")}>Tạo mới</Button>
```
- **Màu**: Blue (bg-blue-600)
- **Sử dụng cho**: Submit, Save, Create, Confirm, Login

### 2. **Secondary** - Hành động phụ
```javascript
<Button {...getButtonProps("secondary")}>Hủy</Button>
<Button {...getButtonProps("secondary")}>Quay lại</Button>
<Button {...getButtonProps("secondary")}>Đóng</Button>
```
- **Màu**: Gray outline
- **Sử dụng cho**: Cancel, Back, Close

### 3. **Success** - Hành động tích cực
```javascript
<Button {...getButtonProps("success")}>Phê duyệt</Button>
<Button {...getButtonProps("success")}>Hoàn thành</Button>
<Button {...getButtonProps("success")}>Chấp nhận</Button>
```
- **Màu**: Green (bg-green-600)
- **Sử dụng cho**: Approve, Complete, Accept

### 4. **Danger** - Hành động phá hủy
```javascript
<Button {...getButtonProps("danger")}>Xóa</Button>
<Button {...getButtonProps("danger")}>Từ chối</Button>
<Button {...getButtonProps("danger")}>Hủy bỏ</Button>
```
- **Màu**: Red (bg-red-600)
- **Sử dụng cho**: Delete, Remove, Reject, Destroy

### 5. **Warning** - Hành động cảnh báo
```javascript
<Button {...getButtonProps("warning")}>Lưu trữ</Button>
<Button {...getButtonProps("warning")}>Tạm dừng</Button>
```
- **Màu**: Orange (bg-orange-600)
- **Sử dụng cho**: Archive, Suspend, Warning actions

### 6. **Info** - Hành động thông tin
```javascript
<Button {...getButtonProps("info")}>Xem chi tiết</Button>
<Button {...getButtonProps("info")}>Thông tin</Button>
```
- **Màu**: Cyan (bg-cyan-600)
- **Sử dụng cho**: View, Details, Info

### 7. **Outlined Primary** - Primary nhẹ hơn
```javascript
<Button {...getButtonProps("outlinedPrimary")}>Xem thêm</Button>
```
- **Màu**: Blue outline
- **Sử dụng cho**: Less prominent primary actions

### 8. **Outlined Secondary** - Secondary nhẹ hơn
```javascript
<Button {...getButtonProps("outlinedSecondary")}>Hủy</Button>
```
- **Màu**: Gray outline nhẹ
- **Sử dụng cho**: Less prominent secondary actions

### 9. **Text Primary** - Text button primary
```javascript
<Button {...getButtonProps("textPrimary")}>Xem thêm</Button>
```
- **Màu**: Blue text only
- **Sử dụng cho**: Minimal primary actions, links

### 10. **Text Secondary** - Text button secondary
```javascript
<Button {...getButtonProps("textSecondary")}>Hủy</Button>
```
- **Màu**: Gray text only
- **Sử dụng cho**: Minimal secondary actions

### 11. **Ghost** - Rất nhẹ
```javascript
<Button {...getButtonProps("ghost")}>Action</Button>
```
- **Màu**: Gray text, subtle hover
- **Sử dụng cho**: Very subtle actions

### 12. **White** - Dùng trên nền tối
```javascript
<Button {...getButtonProps("white")}>Bắt đầu</Button>
```
- **Màu**: White background
- **Sử dụng cho**: Buttons on dark backgrounds

## Ví dụ trong Form

```javascript
import { getButtonProps } from "@/utils/buttonStyles";
import { Button } from "@material-tailwind/react";

const MyForm = () => {
  return (
    <form onSubmit={handleSubmit}>
      {/* Fields here */}

      <div className="flex gap-3 mt-6">
        <Button
          type="submit"
          {...getButtonProps("primary")}
          fullWidth
        >
          Lưu
        </Button>

        <Button
          type="button"
          {...getButtonProps("secondary")}
          onClick={handleCancel}
        >
          Hủy
        </Button>
      </div>
    </form>
  );
};
```

## Ví dụ trong Table Actions

```javascript
<div className="flex gap-2">
  <Button
    size="sm"
    {...getButtonProps("info")}
    onClick={() => handleView(id)}
  >
    Xem
  </Button>

  <Button
    size="sm"
    {...getButtonProps("warning")}
    onClick={() => handleEdit(id)}
  >
    Sửa
  </Button>

  <Button
    size="sm"
    {...getButtonProps("danger")}
    onClick={() => handleDelete(id)}
  >
    Xóa
  </Button>
</div>
```

## Ví dụ với Icon

```javascript
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

<Button
  {...getButtonProps("danger")}
  className="flex items-center gap-2"
>
  <TrashIcon className="h-4 w-4" />
  Xóa
</Button>
```

## Best Practices

1. **Primary cho hành động chính**: Chỉ nên có 1 primary button trong 1 section/form
2. **Secondary cho hành động phụ**: Cancel, Back, Close
3. **Danger cho hành động phá hủy**: Luôn confirm trước khi thực hiện
4. **Success cho hành động tích cực**: Approve, Complete
5. **Consistent sizing**: Dùng `size="sm"`, `size="lg"` consistent trong cùng 1 context
6. **Custom classes**: Có thể thêm custom classes thông qua parameter thứ 2

## Customization

Nếu cần custom colors khác, thêm vào `BUTTON_COLORS` object trong `buttonStyles.js`:

```javascript
export const BUTTON_COLORS = {
  // ... existing colors

  custom: {
    color: "purple",
    variant: "filled",
    className: "bg-purple-600 hover:bg-purple-700 shadow-md",
  },
};
```
