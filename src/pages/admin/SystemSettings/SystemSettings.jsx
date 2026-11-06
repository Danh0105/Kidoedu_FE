import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TextField,
    Switch,
    Snackbar,
    Tooltip,
    Divider,
    CircularProgress,
} from "@mui/material";
import { Sun, Moon, Save, Edit, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

// ---------------------------
// System Settings Dashboard
// - MUI theme (light/dark)
// - Icons (lucide-react)
// - Inline edit with animation
// - Snackbar toasts
// ---------------------------

function Row({ k, v, onSave }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(v ?? "");
    const [show, setShow] = useState(false);

    useEffect(() => setValue(v ?? ""), [v]);

    return (
        <TableRow hover>
            <TableCell sx={{ width: 260, fontWeight: 700 }}>
                {k === "MAIL_USER_SENT"
                    ? "Email gửi xác thực"
                    : k === "MAIL_USER"
                        ? "Email nhận thông báo"
                        : k === "MAIL_PASS_SENT"
                            ? "Mật khẩu email gửi xác thực" : "Mật khẩu email nhận thông báo"
                }
            </TableCell>

            <TableCell>
                {!editing ? (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box sx={{ maxWidth: 680, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {k.toLowerCase().includes("pass") && !show ? "••••••••••" : value}
                        </Box>

                        <Box display="flex" gap={1}>
                            {k.toLowerCase().includes("pass") && (
                                <Tooltip title={show ? "Hide" : "Show"}>
                                    <IconButton size="small" onClick={() => setShow(s => !s)}>
                                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </IconButton>
                                </Tooltip>
                            )}

                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<Edit size={14} />}
                                onClick={() => setEditing(true)}
                            >
                                Edit
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box display="flex" gap={1} alignItems="center">
                        <TextField
                            size="small"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            sx={{ minWidth: 360 }}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<Save size={14} />}
                                onClick={() => {
                                    onSave(k, value);
                                    setEditing(false);
                                    setShow(false);
                                }}
                            >
                                Save
                            </Button>
                        </motion.div>

                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                setEditing(false);
                                setValue(v ?? "");
                                setShow(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </TableCell>
        </TableRow>
    );
}

export default function SystemSettingsDashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    primary: { main: "#1976d2" },
                    background: { default: darkMode ? "#0f1720" : "#f4f6fb" },
                },
                components: {
                    MuiPaper: {
                        styleOverrides: {
                            root: { borderRadius: 12 },
                        },
                    },
                },
            }),
        [darkMode]
    );

    const load = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
            setSettings(res.data);
        } catch (err) {
            console.error(err);
            setToast({ type: "error", text: "Không thể tải settings" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSave = async (key, value) => {
        // optimistic UI: update local state immediately
        setSettings(prev => prev.map(s => (s.key === key ? { ...s, value } : s)));
        setToast({ type: "info", text: `Đang lưu ${key}...` });

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/settings/${encodeURIComponent(key)}`, { value });
            setToast({ type: "success", text: `Đã lưu ${key}` });
        } catch (err) {
            console.error(err);
            setToast({ type: "error", text: `Lưu thất bại ${key}` });
            // reload to revert optimistic change
            await load();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 6 }}>
                <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                            System Settings
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1} mr={2}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                                {darkMode ? "Dark" : "Light"}
                            </Typography>
                            <Switch checked={darkMode} onChange={() => setDarkMode(d => !d)} />
                        </Box>

                        <Tooltip title="Reload settings">
                            <IconButton onClick={load}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 10-2.8 6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>

                <Box maxWidth="1100px" mx="auto" px={2}>
                    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Thiết lập hệ thống</Typography>
                                <Typography variant="body2" color="text.secondary">Quản lý cấu hình: MAIL_USER, MAIL_PASS, MAIL_NOTIFY...</Typography>
                            </Box>

                            <Box display="flex" gap={2} alignItems="center">
                                <Box display="flex" alignItems="center" gap={1}>
                                    {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                                    <Typography variant="caption" color="text.secondary">Theme</Typography>
                                </Box>

                                <Button variant="outlined" size="small" onClick={() => { setToast({ type: 'info', text: 'Demo: settings chưa lưu sẽ bị mất khi reload' }); }}>
                                    Help
                                </Button>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {loading ? (
                            <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Key</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Value</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {settings.map(s => (
                                        <Row key={s.key} k={s.key} v={s.value} onSave={handleSave} />
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        <Box mt={2}>
                            <Typography variant="caption" color="text.secondary">Lưu ý: MAIL_PASS nên là App Password. Thay đổi có hiệu lực ngay.</Typography>
                        </Box>
                    </Paper>

                    <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Tips</Typography>
                        <Typography variant="body2" color="text.secondary">- Tích hợp icon từ lucide-react để giao diện đồng nhất.\n- Dùng framer-motion cho animation mượt mà khi thao tác Lưu.</Typography>
                    </Paper>
                </Box>

                <Snackbar
                    open={Boolean(toast)}
                    autoHideDuration={3000}
                    onClose={() => setToast(null)}
                    message={toast?.text}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Box>
        </ThemeProvider>
    );
}
