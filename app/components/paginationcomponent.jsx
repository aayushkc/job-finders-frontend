"use client"
import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationComponent({onChange, totalPage,page}) {
  return (
    <Stack spacing={2}>
      <Pagination count={totalPage} page={page} variant="outlined" shape="rounded" onChange={(e,page) => onChange(e,page)} />
    </Stack>
  );
}