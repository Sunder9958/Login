import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, List, ListItem } from '@mui/material';
import ReplyList from './ReplyList';

const CommentSection = ({ comment }) => {
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/comments/${comment._id}/replies`, { text: replyText }, { headers: { Authorization: `Bearer ${token}` } });
      setReplyText('');
      // Optionally refetch comments or handle the new reply locally
    } catch (error) {
      console.error('Failed to post reply', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">{comment.text}</Typography>
      <TextField
        label="Reply"
        variant="outlined"
        fullWidth
        margin="normal"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <Button onClick={handleReplySubmit} variant="contained" color="secondary">
        Post Reply
      </Button>
      <ReplyList replies={comment.replies} />
    </div>
  );
};

export default CommentSection;
