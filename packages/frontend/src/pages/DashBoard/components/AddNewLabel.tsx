import React from 'react';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';

export function AddNewLabel(props: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onClick: () => Promise<void>;
}) {
  return (
    <>
      <Input name="label" type="text" label="label" onChange={props.onChange} value={props.value} />
      <Button onClick={props.onClick}>add a new label</Button>
    </>
  );
}
