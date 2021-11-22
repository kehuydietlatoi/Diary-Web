import React, { useContext, useState, ChangeEvent, useCallback } from 'react';
import { Input } from '../../../components/Input';
import { Option, SelectInput } from '../../../components/SelectInput';
import { Button, DangerButton } from '../../../components/Button';
import { labelContext } from '../../../contexts/LabelContext';
import { DiaryEntry } from './DiaryEntriesList';
import DatePicker from 'react-datepicker';
import { InputMultiline } from '../../../components/InputMultiline';

interface EditDiaryEntryFormState {
  name: string;
  labels: Option[];
  text: string;
  date: Date;
}

export const EditDiaryEntryForm: React.FC<{
  afterSubmit: () => void;
  diary: DiaryEntry;
}> = ({ afterSubmit, diary }) => {
  const {
    labels,
    actions: { refetch: refetchLabels },
  } = useContext(labelContext);
  const [values, setValues] = useState<EditDiaryEntryFormState>(diary);
  const fieldDidChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onDateChange = (date: Date) => {
    setValues({ ...values, ['date']: date });
  };
  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`/api/diary/${diary.id}`, {
      body: JSON.stringify({
        ...values,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    });
    await refetchLabels();
    afterSubmit();
  };

  const deleteDiaryEntry = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await fetch(`/api/diary/${diary.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    });
    afterSubmit();
  };
  return (
    <form onSubmit={onSubmitForm}>
      <p>Pick a Date for your Diary, default value is today</p>
      <DatePicker
        name="date"
        selected={new Date(values.date)}
        onChange={onDateChange}
        maxDate={new Date()}
        minDate={new Date('2019-11-11')}
      />
      <Input name="name" type="text" label="Name" onChange={fieldDidChange} required value={values.name} />
      <InputMultiline name="text" type="textarea" label="Text" onChange={fieldDidChange} required value={values.text} />

      <SelectInput
        label="Labels"
        options={labels}
        initialState={{ inputValue: '', selectedOptions: values.labels }}
        onChangeSelectedOptions={(options) => {
          setValues({ ...values, labels: options });
        }}
      />
      <Button type="submit">Edit Diary</Button>
      <DangerButton onClick={deleteDiaryEntry}>Delete Diary</DangerButton>
    </form>
  );
};
