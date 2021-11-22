import React, { useContext, useState, ChangeEvent } from 'react';
import { Input } from '../../../components/Input';
import { InputMultiline } from '../../../components/InputMultiline';
import { SelectInput } from '../../../components/SelectInput';
import { Button } from '../../../components/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { labelContext } from '../../../contexts/LabelContext';

export const AddDiaryEntryForm: React.FC<{ afterSubmit: () => void }> = ({ afterSubmit }) => {
  const {
    labels,
    actions: { refetch: refetchLabels },
  } = useContext(labelContext);
  const [values, setValues] = useState({
    name: '',
    labels: [],
    text: '',
    date: new Date(),
  });
  const fieldDidChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onDateChange = (date: Date) => {
    setValues({ ...values, ['date']: date });
  };
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('/api/diary', {
      body: JSON.stringify({
        ...values,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    await refetchLabels();
    afterSubmit();
  };
  return (
    <form onSubmit={onSubmitForm}>
      <p>Pick a Date for your Diary, default value is today</p>
      <DatePicker
        name="date"
        selected={values.date}
        onChange={onDateChange}
        maxDate={new Date()}
        minDate={new Date('2019-11-11')}
      />
      <Input name="name" type="text" label="Name" onChange={fieldDidChange} required value={values.name} />
      <InputMultiline name="text" type="textarea" label="Text" onChange={fieldDidChange} required value={values.text} />
      <SelectInput
        label="Labels"
        options={labels}
        onChangeSelectedOptions={(options) => {
          // @ts-ignore
          setValues({ ...values, labels: options });
        }}
      />
      <Button type="submit">Add Diary</Button>
    </form>
  );
};
