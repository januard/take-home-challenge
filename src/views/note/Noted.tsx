
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';


const Noted = () => {
    const theme = useTheme();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedNote, setSelectedNote] = useState<any>(null);
    const [notesData, setNotesData] = useState<any[]>([]);

    const API_URL = 'http://localhost:5025/api/notes'; 

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await axios.get(API_URL);
            setNotesData(res.data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
        }
    };

    const handleEditClick = (note: any) => {
        setSelectedNote(note);
        setOpenDialog(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchNotes(); // refresh list
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedNote(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSelectedNote({ ...selectedNote, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedNote({ ...selectedNote, status: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            if (selectedNote.id) {
                // Update existing note
                await axios.put(`${API_URL}/${selectedNote.id}`, selectedNote);
            } else {
                // Create new note
                await axios.post(API_URL, selectedNote);
            }
            fetchNotes();
            handleClose();
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ background: "linear-gradient(to bottom, #173039, #00b4c9)" }}>
                <Box
                    sx={{
                        padding: "50px 80px",
                        [theme.breakpoints.up("sm")]: { maxWidth: "1400px" },
                        width: "calc(100vw - 6px)",
                        margin: "auto",
                        textAlign: "left",
                    }}
                >
                    <Stack
                        spacing={{ xs: 1, sm: 2 }}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ flexWrap: "wrap" }}
                    >
                        <Typography sx={{ fontSize: "30px", color: "#fff", fontWeight: 700, marginBottom: "20px" }}>
                            Notes
                        </Typography>
                        <Button onClick={() => setOpenDialog(true)} variant="contained" sx={{ marginBottom: "20px" }}>
                            NEW NOTE
                        </Button>
                    </Stack>
                </Box>
            </Box>

            {/* Table */}
            <Box sx={{ padding: "20px 80px" }}>
                <TableContainer component={Paper} sx={{ border: "2px solid #00b4c9" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Title</strong></TableCell>
                                <TableCell><strong>Note</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Created At</strong></TableCell>
                                <TableCell><strong>Updated At</strong></TableCell>
                                <TableCell align="center"><strong>#</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notesData.map((note) => (
                                <TableRow key={note.id}>
                                    <TableCell>{note.title}</TableCell>
                                    <TableCell>{note.note}</TableCell>
                                    <TableCell>{note.status}</TableCell>
                                    <TableCell>{new Date(note.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(note.updatedAt).toLocaleString()}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEditClick(note)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(note.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Dialog */}
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>{selectedNote?.id ? "Edit Note" : "Add Note"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        name="title"
                        label="Title"
                        value={selectedNote?.title || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                        name="note"
                        label="Note"
                        value={selectedNote?.note || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        select
                        name="status"
                        label="Status"
                        value={selectedNote?.status || ""}
                        onChange={handleStatusChange}
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button fullWidth variant="contained" onClick={handleUpdate}>
                        {selectedNote?.id ? "UPDATE" : "CREATE"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ height: "25vh" }} />
        </Box>
    );
}

export default Noted