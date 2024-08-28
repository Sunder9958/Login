import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';
import CommentSection from './CommentSection';

const HomePage = () => {
  const [comments, setComments] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const result = await axios.get('/api/comments');
      setComments(result.data);
    };
    fetchComments();
  }, []);

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/comments', { text: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setNewComment('');
      // Fetch comments again
      const result = await axios.get('/api/comments');
      setComments(result.data);
    } catch (error) {
      console.error('Failed to post comment', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Comments</Typography>
      <TextField
        label="New Comment"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button onClick={handleCommentSubmit} variant="contained" color="primary">
        Post Comment
      </Button>
      {comments.map(comment => (
        <Paper key={comment._id} style={{ margin: '20px 0', padding: '10px' }}>
          <CommentSection comment={comment} />
        </Paper>
      ))}
    </Container>
  );
};

export default HomePage;

