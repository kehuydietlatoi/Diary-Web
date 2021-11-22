import React from 'react';
import { Input } from '../../../components/Input';
import { MenuItem, Select } from '@mui/material';

export function SearchBar(props: {
  onChangeSearchField: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onChangeFilter: (e: any) => void;
}) {
  return (
    <>
      <Input name="search" type="text" label="search" onChange={props.onChangeSearchField} />
      <Select value={props.value} onChange={props.onChangeFilter}>
        <MenuItem value={'label'}>Label</MenuItem>
        <MenuItem value={'name'}>Name</MenuItem>
        <MenuItem value={'date'}>Date</MenuItem>
      </Select>
    </>
  );
}
