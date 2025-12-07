---
description: Phase 3 - Migrate Product Module (Week 5-6)
---

# Phase 3: Migrate Product Module

## Mục tiêu

Migrate toàn bộ Product module sang Shadcn/UI với QR code functionality.

---

## Step 1: AllProducts Page

### 1.1 Setup React Query hook

**File: `src/hooks/useProducts.js`**

```javascript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProducts,
  getProductById,
} from "@/services/general/ProductService";

export function useProducts() {
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  return useQuery({
    queryKey: ["products", companyId],
    queryFn: () => getAllProducts(companyId, token),
    enabled: !!companyId && !!token,
  });
}

export function useProduct(productId) {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId, token),
    enabled: !!productId && !!token,
  });
}
```

### 1.2 Create AllProducts page with new DataTable

**File: `src/pages/general/product/AllProducts.jsx`**

```javascript
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { QrCode, Eye } from "lucide-react";
import { createSortableHeader } from "@/lib/table-helpers";

export default function AllProducts() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();

  const columns = [
    {
      accessorKey: "productCode",
      header: createSortableHeader("Mã sản phẩm"),
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên sản phẩm"),
    },
    {
      accessorKey: "moCode",
      header: "Lệnh sản xuất",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const variant =
          {
            "Trong kho": "default",
            "Đã xuất": "secondary",
            "Đã bán": "success",
          }[status] || "default";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/products/${row.original.productId}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShowQR(row.original)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>DANH SÁCH SẢN PHẨM</CardTitle>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={10} columns={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>DANH SÁCH SẢN PHẨM</CardTitle>
          <Button onClick={() => navigate("/product/scan")}>
            <QrCode className="mr-2 h-4 w-4" />
            Quét QR Code
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={products || []}
            searchKey="productCode"
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Step 2: ProductDetail Page

### 2.1 Install additional components

```bash
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add separator
```

### 2.2 Create ProductDetail page

**File: `src/pages/general/product/ProductDetail.jsx`**

```javascript
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { ArrowLeft, QrCode } from "lucide-react";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="p-6">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.productCode}</h1>
            <p className="text-muted-foreground">{product.itemName}</p>
          </div>
        </div>
        <Button>
          <QrCode className="mr-2 h-4 w-4" />
          Xem QR Code
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Mã sản phẩm" value={product.productCode} />
              <Separator />
              <InfoRow label="Tên sản phẩm" value={product.itemName} />
              <Separator />
              <InfoRow label="Lệnh sản xuất" value={product.moCode} />
              <Separator />
              <InfoRow
                label="Trạng thái"
                value={<Badge>{product.status}</Badge>}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">{/* History timeline */}</TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
```

---

## Step 3: ScanQR Page

### 3.1 Install QR scanner library

```bash
npm install react-qr-scanner
```

### 3.2 Create ScanQR page

**File: `src/pages/general/product/ScanQR.jsx`**

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Camera } from "lucide-react";

export default function ScanQR() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      // Parse QR data and navigate to product
      const productId = parseQRData(data);
      navigate(`/products/${productId}`);
    }
  };

  const handleError = (err) => {
    setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
  };

  return (
    <div className="p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Quét QR Code Sản Phẩm</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {scanning ? (
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Button onClick={() => setScanning(true)}>
                  <Camera className="mr-2 h-4 w-4" />
                  Bắt đầu quét
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Đưa QR code vào khung hình để quét
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Step 4: ProductQRModal

### 4.1 Install QR code generator

```bash
npm install qrcode.react
npx shadcn-ui@latest add dialog
```

### 4.2 Create ProductQRModal

**File: `src/components/general/product/ProductQRModal.jsx`**

```javascript
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ProductQRModal({ open, onOpenChange, product }) {
  const handleDownload = () => {
    const svg = document.getElementById("product-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${product.productCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code - {product?.productCode}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <QRCodeSVG
            id="product-qr"
            value={JSON.stringify({
              productId: product?.productId,
              productCode: product?.productCode,
            })}
            size={256}
            level="H"
            includeMargin
          />
          <div className="text-center">
            <p className="font-semibold">{product?.productCode}</p>
            <p className="text-sm text-muted-foreground">{product?.itemName}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Step 5: QRScannerModal

### 5.1 Create QRScannerModal

**File: `src/components/general/product/QRScannerModal.jsx`**

```javascript
import { useState } from "react";
import QrScanner from "react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function QRScannerModal({ open, onOpenChange, onScan }) {
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        onScan(parsed);
        onOpenChange(false);
      } catch (err) {
        setError("QR code không hợp lệ");
      }
    }
  };

  const handleError = (err) => {
    setError("Không thể truy cập camera");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quét QR Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Checklist

- [ ] useProducts hook created with React Query
- [ ] AllProducts page migrated
- [ ] ProductDetail page migrated with Tabs
- [ ] ScanQR page with camera access
- [ ] ProductQRModal with download feature
- [ ] QRScannerModal reusable component
- [ ] All QR functionality tested
- [ ] Navigation between pages working

---

## Testing

1. Test product list loading and search
2. Test product detail view
3. Test QR code generation and download
4. Test QR code scanning
5. Test navigation from scanned QR
6. Test error handling for camera access

---

## Next Phase

👉 **Phase 4: Migrate Manufacturing Module**
