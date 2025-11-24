import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon,
  Description as DocumentIcon,
  Inventory as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  Sell as SaleIcon,
  Factory as ManufacturingIcon,
  LocalShipping as DeliveryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Quick access menu items
  const quickAccessItems = [
    { title: 'Trang chủ', path: '/homepage', icon: <TrendingIcon />, category: 'Tổng quan' },
    { title: 'Quản lý kho', path: '/inventory', icon: <InventoryIcon />, category: 'Kho' },
    { title: 'Đơn mua hàng', path: '/pos', icon: <PurchaseIcon />, category: 'Mua hàng' },
    { title: 'Đơn bán hàng', path: '/sos', icon: <SaleIcon />, category: 'Bán hàng' },
    { title: 'Công lệnh sản xuất', path: '/mos', icon: <ManufacturingIcon />, category: 'Sản xuất' },
    { title: 'Đơn vận chuyển', path: '/dos', icon: <DeliveryIcon />, category: 'Vận chuyển' },
    { title: 'Quản lý hàng hóa', path: '/items', icon: <DocumentIcon />, category: 'Thông tin' },
    { title: 'Nhập kho', path: '/receive-tickets', icon: <InventoryIcon />, category: 'Kho' },
    { title: 'Xuất kho', path: '/issue-tickets', icon: <InventoryIcon />, category: 'Kho' },
    { title: 'Yêu cầu báo giá', path: '/rfqs', icon: <PurchaseIcon />, category: 'Mua hàng' },
  ];

  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      // Filter quick access items based on search query
      const filtered = quickAccessItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleNavigate = (path, title) => {
    // Save to recent searches
    const newRecent = [
      { title, path, timestamp: new Date() },
      ...recentSearches.filter((item) => item.path !== path),
    ].slice(0, 5);
    
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    navigate(path);
    handleClose();
    setSearchQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const open = Boolean(anchorEl);

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <TextField
        ref={inputRef}
        placeholder="Tìm kiếm... (Ctrl+K)"
        size="small"
        value={searchQuery}
        onChange={handleSearch}
        onFocus={handleFocus}
        sx={{
          width: { xs: 200, sm: 300, md: 400 },
          '& .MuiOutlinedInput-root': {
            bgcolor: 'action.hover',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'action.selected',
            },
            '&.Mui-focused': {
              bgcolor: 'background.paper',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchQuery('')}
                edge="end"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableRestoreFocus
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: anchorEl?.offsetWidth || 400,
              maxHeight: 500,
              overflow: 'auto',
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {searchQuery ? (
            // Search Results
            <>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Kết quả tìm kiếm ({searchResults.length})
              </Typography>
              {searchResults.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {searchResults.map((item, index) => (
                    <React.Fragment key={item.path}>
                      <ListItem
                        button
                        onClick={() => handleNavigate(item.path, item.title)}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={item.category}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      {index < searchResults.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Không tìm thấy kết quả cho "{searchQuery}"
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            // Recent Searches & Quick Access
            <>
              {recentSearches.length > 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tìm kiếm gần đây
                    </Typography>
                    <IconButton size="small" onClick={clearRecentSearches}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <List sx={{ p: 0, mb: 2 }}>
                    {recentSearches.map((item) => (
                      <ListItem
                        key={item.path}
                        button
                        onClick={() => handleNavigate(item.path, item.title)}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <HistoryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Truy cập nhanh
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {quickAccessItems.slice(0, 6).map((item) => (
                  <Chip
                    key={item.path}
                    icon={item.icon}
                    label={item.title}
                    size="small"
                    onClick={() => handleNavigate(item.path, item.title)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                      },
                    }}
                  />
                ))}
              </Box>
            </>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default GlobalSearch;
