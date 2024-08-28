import React from 'react';
import { List, ListItem, Typography } from '@mui/material';

const ReplyList = ({ replies }) => (
  <List>
    {replies.map(reply => (
      <ListItem key={reply._id}>
        <Typography variant="body1">{reply.text}</Typography>
      </ListItem>
    ))}
  </List>
);

export default ReplyList;